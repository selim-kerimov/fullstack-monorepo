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
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const userUpdateInputSchema = z.object({
  id: z.string(),
  data: userOutputSchema.partial(),
});

export type UserCreateSchema = z.infer<typeof userCreateSchema>;
export type UserOutputSchema = z.infer<typeof userOutputSchema>;
