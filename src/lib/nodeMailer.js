import nodemailer from "nodemailer";
import emailFormate from "./emailFormate";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.NODE_MAILER_USER,
    pass: process.env.NODE_MAILER_PASSWORD,
  },
});

export default async function sendEmail({ receiverEmail, name,url }) {
  try {
    const info = await transporter.sendMail({
      from: process.env.NODE_MAILER_USER, // sender address
      to: receiverEmail,
      subject: "email verification",
      html: emailFormate(name, url),
    });
    console.log(info);
  } catch (error) {
    throw new Error("error to sending verification email try again later");
  }
}
