import z from 'zod';

export const userCreateSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  email: z.string(),
  password: z.string(),
});

export const userOutputSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  email: z.email(),
  isVerified: z.boolean(),
  role: z.enum(['USER', 'ADMIN']),
});

export type UserCreateBody = z.infer<typeof userCreateSchema>;
