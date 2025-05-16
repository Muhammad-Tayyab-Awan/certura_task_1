import Joi from "joi";

const AuthenticationSchema = Joi.object({
  username: Joi.string()
    .pattern(/^[a-z0-9]{6,18}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Username must consist of 6 to 18 chars (lowercase and numbers only)",
      "string.empty": "Username is required",
    }),
  password: Joi.string()
    .min(8)
    .pattern(/[a-z].*[a-z].*[a-z]/, "at least 3 lowercase letters")
    .pattern(/[A-Z].*[A-Z]/, "at least 2 uppercase letters")
    .pattern(/\d.*\d/, "at least 2 numbers")
    .pattern(/[^a-zA-Z0-9]/, "at least 1 symbols")
    .required()
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 8 characters long.",
      "string.pattern.name":
        "Password must contain at least 2 uppercase, 3 lowercase, 2 numbers, and 1 symbols.",
    })
    .max(18),
});

export default AuthenticationSchema;
