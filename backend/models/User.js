import { model, Schema } from "mongoose";

const addressSchema = new Schema({
  country: {
    type: String,
    enum: [
      "Afghanistan",
      "Iraq",
      "Libya",
      "Pakistan",
      "Palestine",
      "Qatar",
      "Syria",
      "Turkey",
      "Yemen",
    ],
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
});

const userSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    accountEmail: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    accountVerified: { type: Boolean, default: false },
    publicEmail: { type: String, required: true },
    birthdate: { type: Date, required: true },
    gender: { type: String, enum: ["male", "female"], required: true },
    address: addressSchema,
    profilePhoto: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/9187/9187604.png",
    },
  },
  { timestamps: true },
);

const User = model("user", userSchema);

export default User;
