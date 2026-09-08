import nodemailer from "nodemailer";

let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) return null;

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS }
  });

  return transporter;
};

export const sendOrderNotification = async ({ to, subject, text }) => {
  const mailer = getTransporter();
  if (!mailer) {
    console.log("Notification skipped: SMTP not configured.");
    return;
  }

  await mailer.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject,
    text
  });
};
