// src/auth/services/otp.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { OTP } from '../entities/otp.entity';
import { EmailService } from './email.service';

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(OTP)
    private otpRepository: Repository<OTP>,
    private emailService: EmailService,
  ) {}

  generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async createOtp(email: string, userId?: number): Promise<string> {
    // Clean up expired OTPs
    await this.otpRepository.delete({ expiresAt: MoreThan(new Date()) });

    const code = this.generateOtp();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    const otp = this.otpRepository.create({
      code,
      email,
      expiresAt,
      userId,
    });

    await this.otpRepository.save(otp);
    return code;
  }

  async verifyOtp(email: string, code: string): Promise<boolean> {
    const otp = await this.otpRepository.findOne({
      where: {
        email,
        code,
        isUsed: false,
        expiresAt: MoreThan(new Date()),
      },
    });

    if (!otp) {
      return false;
    }

    // Mark OTP as used
    await this.otpRepository.update(otp.id, { isUsed: true });
    return true;
  }

  async sendOtpEmail(email: string, otpCode: string): Promise<boolean> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Verify Your Email</h2>
        <p>Your OTP code is:</p>
        <div style="background: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; letter-spacing: 5px; margin: 20px 0;">
          <strong>${otpCode}</strong>
        </div>
        <p>This code will expire in 15 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    `;

    return await this.emailService.sendEmail({
      to: email,
      subject: 'Your OTP Verification Code',
      html,
    });
  }

  getRemainingEmails(): number {
    return this.emailService.getRemainingEmails();
  }
}
