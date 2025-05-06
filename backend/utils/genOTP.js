import OTP from "../models/OTP.js";

export default async function genOTP(userId) {
  const otpCode = parseInt(
    `${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 9)}`,
  );
  const generatedAt = new Date().toLocaleString();
  await OTP.create({
    otpCode: otpCode,
    generatedAt: generatedAt,
    userId: userId,
  });
  return otpCode;
}
