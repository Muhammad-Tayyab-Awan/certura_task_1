import { model, Schema } from "mongoose";

const otpSchema = new Schema({
  otpCode: { type: Number, required: true },
  generatedAt: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, required: true, ref: "user" },
  status: { type: String, enum: ["verified", "expired", "pending"] },
});

const OTP = model("otp", otpSchema);

export default OTP;
