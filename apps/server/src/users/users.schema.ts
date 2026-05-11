import z from 'zod';

export const userCreateSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  email: z.email(),
  password: z.string().min(6, 'Password must be at least 8 characters'),
});

export const userOutputSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  email: z.string(),
  createdAt: z.union([z.date(), z.string()]),
  updatedAt: z.union([z.date(), z.string()]),
});

export const userUpdateInputSchema = z.object({
  id: z.string(),
  data: userOutputSchema.partial(),
});

export type UserCreateSchema = z.infer<typeof userCreateSchema>;
export type UserOutputSchema = z.infer<typeof userOutputSchema>;
