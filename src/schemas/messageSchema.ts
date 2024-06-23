import { z } from "zod";

export const messageSchemaValidation = z.object({
  content: z
    .string()
    .min(20, { message: "Content must be at least 20 characters" })
    .max(200, { message: "Content must be no longer than 200 characters" }),
});
