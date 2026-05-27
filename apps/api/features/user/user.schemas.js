import * as z from 'zod';

export const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.email(),
  password: z.string(),
  email_verified: z.boolean().default(false),
});

/** @typedef { z.infer<typeof UserSchema> } User*/
