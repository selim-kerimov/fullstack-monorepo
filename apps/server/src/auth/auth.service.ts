import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { DatabaseService } from '../database/database.service.js';
import { SignupDto } from './dto/signup.dto.js';
import { ConfirmOtpDto } from './dto/confirm-otp.dto.js';

@Injectable()
export class AuthService {
  constructor(private readonly db: DatabaseService) {}

  async signup(dto: SignupDto) {
    const existing = await this.db.user.findUnique({
      where: { email: dto.email },
    });

    if (existing?.isVerified) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = existing
      ? await this.db.user.update({
          where: { email: dto.email },
          data: { password: hashedPassword },
        })
      : await this.db.user.create({
          data: {
            fullName: dto.fullName,
            email: dto.email,
            password: hashedPassword,
          },
        });

    // Invalidate any previous unused OTP codes
    await this.db.otpCode.updateMany({
      where: { userId: user.id, used: false },
      data: { used: true },
    });

    const code = this.generateOtp();
    const expiresAt = new Date(
      Date.now() + Number(process.env.OTP_EXPIRES_IN_MINUTES ?? 10) * 60 * 1000,
    );

    await this.db.otpCode.create({
      data: { code, userId: user.id, expiresAt },
    });

    console.log(`Otp code for ${dto.email}: ${code}`);

    return {
      success: true,
      message: 'User registered. Please confirm your email with the OTP code.',
    };
  }

  async confirmOtp(dto: ConfirmOtpDto) {
    const user = await this.db.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new ForbiddenException('Invalid email or OTP code');
    }

    const otpRecord = await this.db.otpCode.findFirst({
      where: {
        userId: user.id,
        code: dto.code,
        used: false,
        expiresAt: { gt: new Date() },
      },
    });

    if (!otpRecord) {
      throw new ForbiddenException('Invalid or expired OTP code');
    }

    await this.db.otpCode.update({
      where: { id: otpRecord.id },
      data: { used: true },
    });

    await this.db.user.update({
      where: { id: user.id },
      data: { isVerified: true },
    });

    return { message: 'Email confirmed successfully' };
  }

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
