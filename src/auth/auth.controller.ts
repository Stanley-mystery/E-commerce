import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Put,
  Req,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpeAuthDto } from './dto';
import { LocalGuard, RefreshJwtGuard } from './guards';
import { ChangePasswordParams, PasswordResetParams } from './utils/auth.types';
import { AuthGuard } from '@nestjs/passport';
import { OAuth2Client } from 'google-auth-library';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  readonly client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
  );

  // sign up user
  @Post('sign-up')
  SignUp(@Body() signUpAuthDto: SignUpeAuthDto) {
    return this.authService.signUpUser(signUpAuthDto);
  }

  // Sign In user
  @UseGuards(LocalGuard)
  @Post('sign-in')
  async signIn(@Request() req) {
    return await this.authService.signinUser(req.user);
  }

  @UseGuards(RefreshJwtGuard)
  @Post('refresh')
  async accessToken(@Request() req) {
    console.log(req.user);

    return this.authService.refreshToken(req.user);
  }

  @Post('change-password/initiate')
  async initiatePasswordChange(@Body('email') email: string) {
    return this.authService.initiatePasswordChange(email);
  }

  @Put('change-password')
  async changePassword(@Body() changePasswordParams: ChangePasswordParams) {
    return this.authService.changePassword(changePasswordParams);
  }

  @Post('password-reset/initiate')
  async initiatePasswordReset(@Body('email') email: string) {
    return this.authService.initiatePasswordReset(email);
  }

  @Put('password-reset')
  async passwordReset(@Body() passwordResetDetails: PasswordResetParams) {
    return this.authService.passwordReset(passwordResetDetails);
  }

  @Post('google/sign-in')
  async login(@Body('token') token): Promise<any> {
    const ticket = await this.client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const data = await this.authService.googleLogin({
      email: payload.email,
      name: payload.name,
    });
    return data;
  }
}
