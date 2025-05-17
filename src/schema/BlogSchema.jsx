import Joi from "joi";

const BlogSchema = Joi.object({
  title: Joi.string()
    .pattern(/^[a-zA-Z ]{15,100}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Title must consist of 15 to 100 chars (lowercase and uppercase and space only)",
      "string.empty": "Title is required",
    }),
  content: Joi.string()
    .min(300)
    .max(3000)
    .pattern(/^[A-Za-z0-9 .,!?'"()\-_:;@#&*/\\\[\]{}<>|+=~`%^$]/)
    .required()
    .messages({
      "string.base": "The input must be a string. Seriously, no shortcuts.",
      "string.empty": "Come on, you can’t leave this empty. Give us something.",
      "string.min":
        "Your message needs to be at least 300 characters. Don’t hold back!",
      "string.max":
        "Whoa! Too much info. Please keep it under 3000 characters.",
      "string.pattern.base":
        "Only allowed characters please! Stick to letters, numbers, and standard punctuation.",
      "any.required": "This field is required. No skipping allowed.",
    }),
  imageURL: Joi.string()
    .uri({ scheme: ["http", "https"] })
    .pattern(/\.(jpg|jpeg|png|gif|webp)$/i)
    .required()
    .messages({
      "string.base":
        "Image URL must be a string. You gave us something... else.",
      "string.empty": "Image URL cannot be empty. Provide us a link!",
      "string.uri":
        "That doesn’t look like a valid URL. Must start with http:// or https://",
      "string.pattern.base":
        "Only image links are allowed (jpg, jpeg, png, gif, webp). No PDFs, no .exe nonsense.",
      "any.required": "Image URL is required.",
    }),
});

export default BlogSchema;
