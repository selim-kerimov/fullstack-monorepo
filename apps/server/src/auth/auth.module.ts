import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service.js';
import { AuthRouter } from './auth.router.js';

@Module({
  imports: [JwtModule.register({})],
  providers: [AuthService, AuthRouter],
})
export class AuthModule {}
