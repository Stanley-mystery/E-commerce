// src/mail/mail.service.ts

import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as crypto from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entitiy';

type MailRecipeint = {
  to: string;
};

@Injectable()
export class MailService {
  private transporter;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    this.transporter = nodemailer.createTransport({
      host: 'sandbox.smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: 'b0e025a15afd85',
        pass: 'b04119529e4410',
      },
    });
  }

  generateOTP(length: number = 6): string {
    return crypto
      .randomInt(0, Math.pow(10, length))
      .toString()
      .padStart(length, '0');
  }

  async sendMail(
    to: string,
    subject: string,
    text: string,
    html?: string,
  ): Promise<void> {
    const mailOptions = {
      from: 'your-email@example.com', // Replace with your "from" email address
      to: 'example@gmail.com',
      subject,
      text,
      html,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendOTP(to: string): Promise<string> {
    const otp = this.generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60000); // Expires in 10 minutes

    const u = await this.userRepository.update(
      { email: to },
      { otp, otpExpiresAt: expiresAt },
    );

    console.log(u);

    const subject = 'Your OTP Code';
    const text = `Your OTP code is ${otp}. It is valid for 10 minutes.`;

    const html = `
      <div style="font-family: Arial, sans-serif; color: #333;">
      <h1 style="color: blue;">LIBRARY</h1>
        <h2 style="color: #4CAF50;">Your OTP Code</h2>
        <p>Thank you for choosing our service. Your OTP code is:</p>
        <p style="font-size: 24px; font-weight: bold;">${otp}</p>
        <p>This code is valid for 10 minutes.</p>
      </div>
    `;

    await this.sendMail(to, subject, text, html);

    return otp;
  }

  async sendPasswordResetLink(to: string): Promise<string> {
    const passwordResetLink = `http://localhost:3000/password-reset`;

    const subject = 'Your Password Reset Link';
    const text = `Click this link  to Reset Password.`;

    const html = `
        <div style="font-family: Arial, sans-serif; color: #333;">
        <h1 style="color: blue;">LIBRARY</h1>
          <h2 style="color: #4CAF50;">Your OTP Code</h2>
          <p>Thank you for choosing our service.Click the link to reset your password:</p>
          <p style="font-size: 24px; font-weight: bold;">	<a className="nav-link text-white px-3" target="_blank" href=${passwordResetLink}>
								Reset Password
							</a></p>
          
        </div>
      `;

    await this.sendMail(to, subject, text, html);

    return passwordResetLink;
  }

  async validateOTP(email: string, otp: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { email } });
    console.log(user);

    if (!user) {
      return false;
    }

    if (user.otp !== otp) {
      return false;
    }

    if (user.otpExpiresAt < new Date()) {
      await this.userRepository.update(
        { email },
        { otp: null, otpExpiresAt: null },
      ); // Clear expired OTP
      return false;
    }

    // OTP is valid; clear it after validation
    await this.userRepository.update(
      { email },
      { otp: null, otpExpiresAt: null },
    );
    return true;
  }
}
