import { Input, Mutation, Router, UseMiddlewares } from 'nestjs-trpc';
import { TrpcLoggerMiddleware } from 'src/trpc/logger.middleware';
import { AuthService } from './auth.service';
import {
  signupSchema,
  signupOutputSchema,
  confirmOtpSchema,
  messageOutputSchema,
  loginSchema,
  loginOutputSchema,
  refreshSchema,
  tokensOutputSchema,
} from './auth.schema';
import type {
  SignupSchema,
  ConfirmOtpSchema,
  LoginSchema,
} from './auth.schema';

@Router({ alias: 'auth' })
@UseMiddlewares(TrpcLoggerMiddleware)
export class AuthRouter {
  constructor(private readonly authService: AuthService) {}

  @Mutation({
    input: signupSchema,
    output: signupOutputSchema,
  })
  signup(@Input() input: SignupSchema) {
    return this.authService.signup(input);
  }

  @Mutation({
    input: confirmOtpSchema,
    output: messageOutputSchema,
  })
  confirm(@Input() input: ConfirmOtpSchema) {
    return this.authService.confirmOtp(input);
  }

  @Mutation({
    input: loginSchema,
    output: loginOutputSchema,
  })
  login(@Input() input: LoginSchema) {
    return this.authService.login(input);
  }

  @Mutation({
    input: refreshSchema,
    output: tokensOutputSchema,
  })
  refresh(@Input('refreshToken') refreshToken: string) {
    return this.authService.refresh(refreshToken);
  }
}
