import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { DatabaseService } from '../database/database.service.js';
import { SignupDto } from './dto/signup.dto.js';
import { ConfirmOtpDto } from './dto/confirm-otp.dto.js';
import { LoginDto } from './dto/login.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly db: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}

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

  async login(dto: LoginDto) {
    const user = await this.db.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new ForbiddenException('Invalid email or password');
    }

    if (!user.isVerified) {
      throw new ForbiddenException(
        'Email not verified. Please confirm your OTP first.',
      );
    }

    const passwordValid = await bcrypt.compare(dto.password, user.password);

    if (!passwordValid) {
      throw new ForbiddenException('Invalid email or password');
    }

    const generatedTokens = await this.generateTokens(user.id, user.email);

    return {
      ...generatedTokens,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
      },
    };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      return this.generateTokens(
        payload.userId as string,
        payload.email as string,
      );
    } catch {
      throw new ForbiddenException('Invalid or expired refresh token');
    }
  }

  private async generateTokens(userId: string, email: string) {
    const payload = { userId, email };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: (process.env.JWT_ACCESS_EXPIRES_IN ?? '1h') as any,
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN ?? '7d') as any,
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
