export const BASE_URL =
  "https://uat-beta-auto.pcrsdev.com/pcmi.web.services/api";

export const AUTH_URL = "https://uat-beta-auto.pcrsdev.com/Pcmi.Web.Sts";

export const config: any = {
  client_secret: process.env.CLIENT_SECRET,
  username: process.env.USER_NAME,
  password: process.env.PASSWORD,
  grant_type: process.env.GRANT_TYPE,
  client_id: process.env.CLIENT_ID,
};

export const SEND_EMAIL_FROM = "info@permasafe.com";

// used to send register numbers of users who have not paid for the past 7 days please add atleast one email here.
export const sendEmailTo = [
  "rolandol@owsadmin.com"



];

// if error occur during cron I am using this email to send error
export const EMAIL_FOR_ERROR_CRON = "rolandol@owsadmin.com";
