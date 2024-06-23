import { z } from "zod";

export const signInSchemaValidation = z.object({
  username: z.string(),
  password: z.string(),
});
