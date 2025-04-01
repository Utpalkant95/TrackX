import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend();

interface ISendEmail {
    to : string;
    subject : string;
    html ?: string;
}

const sendEmail = async (data: ISendEmail) => {
  try {
    const resendData = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [data.to],
      subject:data.subject,
      html: data.html || "<strong>email sent</strong>",
    });
    console.log("email sent successfully", resendData);
    
    return resendData;
  } catch (error) {
    console.log("error in sending email", error);
    
    return error;
  }
};

export default sendEmail