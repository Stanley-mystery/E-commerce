// src/mail/mail.controller.ts

import { Controller, Post, Body } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('send-otp')
  async sendOTP(@Body('to') to: string): Promise<{ otp: string }> {
    const otp = await this.mailService.sendOTP(to);
    return { otp };
  }

  @Post('validate-otp')
  async validateOTP(
    @Body('email') email: string,
    @Body('otp') otp: string,
  ): Promise<{ valid: boolean }> {
    const isValid = await this.mailService.validateOTP(email, otp);
    return { valid: isValid };
  }
}
