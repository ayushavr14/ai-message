import { z } from "zod";

export const signInSchemaValidation = z.object({
  email: z.string(),
  password: z.string(),
});
