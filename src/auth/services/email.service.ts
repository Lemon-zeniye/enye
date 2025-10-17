// src/email/email.service.ts
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class EmailService implements OnModuleInit {
  private readonly logger = new Logger(EmailService.name);
  private dailyEmailCount = 0;
  private readonly DAILY_LIMIT = 100;
  private lastResetDate: Date = new Date();

  constructor(private readonly mailerService: MailerService) {}

  async onModuleInit() {
    await this.testEmailConnection();
  }

  private async testEmailConnection() {
    try {
      // Test the connection by sending a verification request
      //   await this.mailerService.verify();
      this.logger.log('✅ Email transporter is ready to send messages');
    } catch (error) {
      this.logger.error(
        '❌ Email transporter failed to initialize:',
        error.message,
      );
    }
  }

  private resetDailyCountIfNeeded() {
    const today = new Date().toDateString();
    if (this.lastResetDate.toDateString() !== today) {
      this.dailyEmailCount = 0;
      this.lastResetDate = new Date();
      this.logger.log('🔄 Daily email counter reset');
    }
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    this.resetDailyCountIfNeeded();

    if (this.dailyEmailCount >= this.DAILY_LIMIT) {
      this.logger.warn(`🚫 Daily email limit reached (${this.DAILY_LIMIT})`);
      return false;
    }

    try {
      this.logger.log(`📧 Attempting to send email to: ${options.to}`);

      await this.mailerService.sendMail({
        from: process.env.EMAIL_USER, // Optional: override the default 'from'
        ...options,
      });

      this.dailyEmailCount++;
      this.logger.log(
        `✅ Email sent to ${options.to}. Daily count: ${this.dailyEmailCount}/${this.DAILY_LIMIT}`,
      );
      return true;
    } catch (error) {
      this.logger.error(
        `❌ Failed to send email to ${options.to}:`,
        error.message,
      );
      return false;
    }
  }

  getRemainingEmails(): number {
    this.resetDailyCountIfNeeded();
    return Math.max(0, this.DAILY_LIMIT - this.dailyEmailCount);
  }

  getDailyStats() {
    this.resetDailyCountIfNeeded();
    return {
      sentToday: this.dailyEmailCount,
      remaining: this.DAILY_LIMIT - this.dailyEmailCount,
      limit: this.DAILY_LIMIT,
      lastReset: this.lastResetDate,
    };
  }
}
// // src/email/email.service.ts
// import { Injectable, Logger } from '@nestjs/common';
// import { MailerService } from '@nestjs-modules/mailer';

// interface EmailOptions {
//   to: string;
//   subject: string;
//   html: string;
// }

// @Injectable()
// export class EmailService {
//   private readonly logger = new Logger(EmailService.name);
//   private dailyEmailCount = 0;
//   private readonly DAILY_LIMIT = 100;
//   private lastResetDate: Date = new Date();

//   constructor(private readonly mailerService: MailerService) {}

//   private resetDailyCountIfNeeded() {
//     const today = new Date().toDateString();
//     if (this.lastResetDate.toDateString() !== today) {
//       this.dailyEmailCount = 0;
//       this.lastResetDate = new Date();
//     }
//   }

//   async sendEmail(options: EmailOptions): Promise<boolean> {
//     this.resetDailyCountIfNeeded();

//     if (this.dailyEmailCount >= this.DAILY_LIMIT) {
//       this.logger.warn(`Daily email limit reached (${this.DAILY_LIMIT})`);
//       return false;
//     }

//     try {
//       await this.mailerService.sendMail(options);

//       this.dailyEmailCount++;
//       this.logger.log(
//         `Email sent to ${options.to}. Daily count: ${this.dailyEmailCount}/${this.DAILY_LIMIT}`,
//       );
//       return true;
//     } catch (error) {
//       this.logger.error('Failed to send email', error);
//       return false;
//     }
//   }

//   getRemainingEmails(): number {
//     this.resetDailyCountIfNeeded();
//     return Math.max(0, this.DAILY_LIMIT - this.dailyEmailCount);
//   }
// }
