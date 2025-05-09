import { model, Schema } from "mongoose";

const otpSchema = new Schema({
  otpCode: { type: String, required: true },
  expiresAt: { type: Number, required: true },
  userId: { type: Schema.Types.ObjectId, required: true, ref: "user" },
  status: {
    type: String,
    enum: ["verified", "expired", "pending"],
    default: "pending",
  },
});

const OTP = model("otp", otpSchema);

export default OTP;
