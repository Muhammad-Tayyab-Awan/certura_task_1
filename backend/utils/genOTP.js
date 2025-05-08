import bcrypt from "bcryptjs";
import OTP from "../models/OTP.js";

export default async function genOTP(userId) {
  const otpCode = `${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 9)}`;
  const generatedAt = new Date().toLocaleString();
  const hashedCode = bcrypt.hashSync(otpCode, bcrypt.genSaltSync(10));
  await OTP.create({
    otpCode: hashedCode,
    generatedAt: generatedAt,
    userId: userId,
  });
  return otpCode;
}
