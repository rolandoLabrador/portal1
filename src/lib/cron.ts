import {
  AUTH_URL,
  BASE_URL,
  config,
  EMAIL_FOR_ERROR_CRON,
  sendEmailTo,
} from "@/app/constants";
import cron from "node-cron";
import prisma from "./prisma";
import { GetRegiserResponse } from "@/app/api/form/route";
import { sendMail } from "./sendEmail";
const cronExpression = {
  EVERY_DAY: "0 0 * * *",
  EVERY_10_MINUTES: "0 */10 * * * *",
  EVERY_MINUTE: "*/1 * * * *",
  EVERY_SECOND: "* * * * * *",
  EVERY_12_HOURS: "0 */12 * * *",
  EVERY_10_SECONDS: "*/10 * * * * *",
};
const fetchAndUpdateToken = async () => {
  console.log("TOKEN_IS", process.env.NEXTAUTH_SECRET);
  const params = new URLSearchParams();
  params.append("client_secret", config.client_secret);
  params.append("username", config.username);
  params.append("password", config.password);
  params.append("grant_type", config.grant_type);
  params.append("client_id", config.client_id);

  const login: any = await fetch(`${AUTH_URL}/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  });
  const finalRes = await login.json();
  console.log("TOKEN", finalRes);
  const res = await prisma.config.findMany();
  if (!res.length) {
    await prisma.config.create({
      data: { token: finalRes.access_token },
    });
  } else {
    await prisma.config.update({
      where: {
        id: res[0].id,
      },
      data: {
        token: finalRes.access_token,
      },
    });
  }
};

const fetchGetRegisterHistory = async (
  registerNumber: string,
  token: string
): Promise<GetRegiserResponse> => {
  const res = await fetch(
    `${BASE_URL}/v2/billing/GetRegisterHistory?registerNumber=${registerNumber}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json", // if you're sending JSON data
      },
    }
  );
  const data: GetRegiserResponse = await res.json();
  console.log("API_DATAA", JSON.stringify(data));
  return data;
};

const checkContractsCancellable = async (
  contractNumbers: string[],
  token: string
) => {
  const fetchPromises = contractNumbers.map((contractNumber) =>
    fetch(`${BASE_URL}/v2/contracts/IsContractCancellable/${contractNumber}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then(async (response) => {
        const responseData = await response.json().catch(() => null);
        return {
          contractNumber,
          status: response.status,
          statusText: response.statusText,
          data: responseData,
          error: !response.ok,
        };
      })
      .catch((error) => {
        return {
          contractNumber,
          error: true,
          message: error.message,
        };
      })
  );

  const results = await Promise.all(fetchPromises);
  return results;
};

const checkMainFunction = async ({
  registerNumber,
  token,
}: {
  registerNumber: string;
  token: string;
}) => {
  const getRegisterHistory = await fetchGetRegisterHistory(
    registerNumber,
    token
  );

  const contractNumbers: string[] = [];
  getRegisterHistory?.registers[0].contractPayments?.forEach((contract) => {
    contractNumbers.push(contract.number);
  });

  if (contractNumbers.length > 0) {
    const checkContracts = await checkContractsCancellable(
      contractNumbers,
      token
    );
    const paidContracts = checkContracts.filter(
      (contract: any) => contract.status !== 400
    )?.length;

    const paidContractsPercentage =
      (paidContracts / contractNumbers.length) * 100;
    if (paidContractsPercentage === 100) {
      await prisma.table.update({
        where: { registerNumber },
        data: { status: "PAID" },
      });
    } else if (paidContractsPercentage < 85) {
      await prisma.table.update({
        where: { registerNumber },
        data: { status: "NOT PAID" },
      });
    } else {
      await prisma.table.update({
        where: { registerNumber },
        data: { status: "PARTIALLY PAID" },
      });
    }
  } else {
    await sendMail({
      email: EMAIL_FOR_ERROR_CRON,
      subject: `Contracts Not Found`,
      text: `No contracts found against ${registerNumber}`,
    });
  }
};

const daysAgo = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

export function initializeCronJobs() {
  // saving token to database when app starts
  fetchAndUpdateToken();
  // cron job to automatically fetch token after 10 minutes
  cron.schedule(cronExpression.EVERY_10_MINUTES, async () => {
    fetchAndUpdateToken();
  });

  // cron job to get all the records and update their status
  cron.schedule(cronExpression.EVERY_12_HOURS, async () => {
    const tableData = await prisma.table.findMany({
      where: { status: { not: "PAID" } },
    });
    const findToken = await prisma.config.findMany();
    const registerNumbers: string[] = [];
    tableData.forEach((table) => {
      registerNumbers.push(table.registerNumber);
    });
    if (registerNumbers.length > 0) {
      for (let i = 0; i < registerNumbers.length; i++) {
        await checkMainFunction({
          registerNumber: registerNumbers[i],
          token: findToken[0]?.token as string,
        });
      }
    }
  });

  // cron job to send an email to users who have not paid for 7 days.
  cron.schedule(cronExpression.EVERY_DAY, async () => {
    const tableData = await prisma.table.findMany({
      where: {
        status: { not: "PAID" },
        entryDate: {
          lt: daysAgo(7),
        },
      },
    });
    if (tableData.length > 0) {
      const registerNumbers = tableData.map((table) => table.registerNumber);
      const emailBody = `The following register numbers have not been paid for the past 7 days:\n\n${registerNumbers.join(
        "\n"
      )}`;
      if (sendEmailTo.length > 0) {
        sendEmailTo.forEach(async (emailTo) => {
          await sendMail({
            email: emailTo,
            subject: "Register Numbers NOT PAID",
            text: emailBody,
          });
        });
      }
    }
  });
}
