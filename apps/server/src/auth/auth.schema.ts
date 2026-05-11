import z from 'zod';

export const signupSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export const confirmOtpSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const refreshSchema = z.object({
  refreshToken: z.string(),
});

export const messageOutputSchema = z.object({
  message: z.string(),
});

export const signupOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

export const loginOutputSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  user: z.object({
    id: z.string(),
    fullName: z.string(),
    email: z.string(),
  }),
});

export const tokensOutputSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

export type SignupSchema = z.infer<typeof signupSchema>;
export type ConfirmOtpSchema = z.infer<typeof confirmOtpSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;
