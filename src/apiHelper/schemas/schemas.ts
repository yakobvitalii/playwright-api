import { z } from 'zod';

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  job: z.string(),
  createdAt: z.string().datetime()
});