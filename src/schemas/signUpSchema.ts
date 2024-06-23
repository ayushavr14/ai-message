import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(4, "Username must be atleast 4 characters")
  .max(8, "Username must be no more that 8 characters")
  .regex(/^[a-zA-Z0-9]+$/, "Username must not contain special character");

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .max(10, { message: "Password not more than 10 characters" })
    .regex(
      /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[0-9]).{8,}$/,
      "Password should contains 1 capital letter, 1 special character and 1 number"
    ),
});
