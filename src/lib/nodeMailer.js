import nodemailer from "nodemailer";
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.NODE_MAILER_USER,
    pass: process.env.NODE_MAILER_PASSWORD,
  },
});

export default async function sendEmail({
  receiverEmail,
  name,
  url,
  subject,
  emailFormate,
}) {
  try {
    const info = await transporter.sendMail({
      from: process.env.NODE_MAILER_USER,
      to: receiverEmail,
      subject: subject,
      html: emailFormate(name, url),
    });
  } catch (error) {
    throw new Error("error to sending verification email try again later");
  }
}
