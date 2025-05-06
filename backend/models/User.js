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
  contactNumber: {
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
    accountEmailVerified: { type: Boolean, default: false },
    accountVerified: { type: Boolean, default: false },
    publicEmail: { type: String, required: true },
    birthdate: { type: Date, required: true },
    gender: { type: String, enum: ["male", "female"], required: true },
    address: addressSchema,
    profilePhoto: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

const User = model("user", userSchema);

export default User;
