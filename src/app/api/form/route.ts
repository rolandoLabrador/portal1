import { BASE_URL } from "@/app/constants";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { registerNumber, dealerName, userName, checkAmount } = body;
    const findToken = await prisma.config.findMany();
    const token: string = findToken[0].token as string;
    // latest data
    const updatedBody: Prisma.TableCreateInput = {
      dealerNumber: "",
      checkNumber: "",
      status: "",
      userName,
      checkAmount,
      dealerName,
      registerNumber,
    };
    // get all contracts number
    const getRegisterHistory = await fetchGetRegisterHistory(
      registerNumber,
      token
    );
    if (getRegisterHistory?.registers?.length === 0) {
      return NextResponse.json(
        {
          message: "No record found against this register number",
        },
        { status: 400 }
      );
    }
    updatedBody.checkNumber =
      getRegisterHistory?.registers[0]?.checkNumber ?? "0";
    updatedBody.dealerNumber = getRegisterHistory?.registers[0]?.dealerNumber;
    const contractNumbers: string[] = [];
    getRegisterHistory?.registers[0].contractPayments?.forEach((contract) => {
      contractNumbers.push(contract.number);
    });

    // Cancellable contracts
    if (contractNumbers.length > 0) {
      const checkContracts = await checkContractsCancellable(
        contractNumbers,
        token
      );
      const paidContracts = checkContracts.filter(
        (contract: any) => contract.status !== 400
      )?.length;

      // percentage of paid contracts
      const paidContractsPercentage =
        (paidContracts / contractNumbers.length) * 100;
      if (paidContractsPercentage === 100) {
        updatedBody.status = "PAID";
        updatedBody.paidDate = new Date();
      } else if (paidContractsPercentage < 85) {
        updatedBody.status = "NOT PAID";
      } else {
        updatedBody.status = "PARTIALLY PAID";
      }
    }
    // find register number
    const findByRegisterNumber = await prisma.table.findFirst({
      where: {
        registerNumber: registerNumber,
      },
    });

    //  if that particular register number doesn't exist create that particular field in table else update it
    if (!findByRegisterNumber) {
      updatedBody.checkNumber = "0";
      console.log("UPDATE", updatedBody);
      const createTable = await prisma.table.create({ data: updatedBody });
      return NextResponse.json({
        message: "Record created successfully",
        data: createTable,
      });
    } else {
      const updateTable = await prisma.table.update({
        where: { registerNumber },
        data: updatedBody,
      });
      return NextResponse.json({
        message: "Record updated successfully",
        data: updateTable,
      });
    }
  } catch (error) {
    console.error("Error in authorize function:", error);
  }
}

export interface GetRegiserResponse {
  registers: {
    dealerNumber: string;
    paymentMethodCode: string;
    checkNumber: string;
    contractPayments: { number: string }[];
  }[];
  totalRecordCount: 1;
}

export interface ITableData {
  dealerNumber: string;
  checkNumber: string;
  userName: string;
  entryDate: string;
  checkAmount: string;
  dealerName: string;
  registerNumber: string;
  status: string;
  paid: string;
}
