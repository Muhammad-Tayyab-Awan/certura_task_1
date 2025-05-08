/* eslint-disable no-undef */
import cloudinary from "cloudinary";
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

cloudinary.v2.config({
  cloud_name: "dkytvzoqk",
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

export default cloudinary;
