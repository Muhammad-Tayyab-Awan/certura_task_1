import bcrypt from "bcryptjs";
import OTP from "../models/OTP.js";

export default async function genOTP(userId) {
  const otpCode = `${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 9)}`;
  let expiresAt = new Date();
  expiresAt = expiresAt.setMinutes(expiresAt.getMinutes() + 10);
  const hashedCode = bcrypt.hashSync(otpCode, bcrypt.genSaltSync(10));
  await OTP.create({
    otpCode: hashedCode,
    expiresAt: expiresAt,
    userId: userId,
  });
  return otpCode;
}
