import { SEND_EMAIL_FROM } from "@/app/constants";
import sgMail from "@sendgrid/mail";

export async function sendMail(data: {
  email: string;
  subject: string;
  text?: string;
  html?: string;
}) {
  try {
    const { email, subject, text, html } = data;
    sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
    const msg: any = {
      to: `${email}`,
      from: `${SEND_EMAIL_FROM}`,
      subject,
    };
    if (html) {
      msg.html = html;
    } else {
      msg.text = text;
    }
    const response = await sgMail.send(msg);
    return response;
  } catch (error) {
    console.log(error);
  }
}
