/* eslint-disable no-undef */
import nodemailer from "nodemailer";

const gmailUser = process.env.GMAIL_USER;
const gmailPassword = process.env.GMAIL_PASS;

const mailTransporter = nodemailer.createTransport({
  secure: true,
  host: "smtp.gmail.com",
  port: 465,
  auth: { user: gmailUser, pass: gmailPassword },
});

export default mailTransporter;
