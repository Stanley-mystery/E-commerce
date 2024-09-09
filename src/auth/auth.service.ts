import {
  BadRequestException,
  ConflictException,
  Get,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ChangePasswordParams,
  PasswordResetParams,
  SiginUserParams,
  SignUpUserParams,
} from './utils/auth.types';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entitiy';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  // signUp user
  async signUpUser(signUpUserDetails: SignUpUserParams) {
    const { name, email, password } = signUpUserDetails;
    const existingUser = await this.userRepository.findOneBy({ email });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // hashing password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    //  creating newUser
    const newUser = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    try {
      // Saving new user to database
      await this.userRepository.save(newUser);
      // returns user without password
      return newUser;
    } catch (error) {
      throw new InternalServerErrorException(
        'Something went wrong while saving the user',
      );
    }
  }

  // signin User /Authenticate user
  async validateUser(signInUserDetails: SiginUserParams) {
    const { email, password } = signInUserDetails;

    const user = await this.userRepository.findOneBy({ email });

    if (!user) {
      throw new UnauthorizedException('wrong credentials');
    }

    // Comparing passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('wrong credentials');
    }

    // Return user data
    return user;
  }

  // signin user
  async signinUser(user: User) {
    // Define the base URL for image paths
    const baseUrl = 'http://localhost:3001/images/';

    // Ensure imagePath is defined; adjust accordingly if needed
    const imagePath = user.imagePath || 'default-profile.png'; // Use a default image if none provided

    // Construct the full image URL
    user.imagePath = `${baseUrl}${imagePath}`;
    const payload = {
      email: user.email,
      sub: {
        name: user.name,
      },
    };

    const { password, ...rest } = user;

    return {
      ...rest,
      backendTokens: {
        accessToken: this.jwtService.sign(payload, {
          expiresIn: '90s',
          secret: process.env.JWT_SECRET,
        }),
        refreshToken: this.jwtService.sign(payload, {
          expiresIn: '7d',
          secret: process.env.REFRESH_TOKEN_KEY,
        }),
        expiresIn: new Date().setTime(new Date().getTime() + 20 * 1000),
      },
    };
  }

  // refresh token
  async refreshToken(user: User) {
    const payload = {
      email: user.email,
      sub: {
        name: user.name,
      },
    };

    return {
      backendTokens: {
        accessToken: this.jwtService.sign(payload, {
          expiresIn: '90s',
          secret: process.env.JWT_SECRET,
        }),
        refreshToken: this.jwtService.sign(payload, {
          expiresIn: '7d',
          secret: process.env.REFRESH_TOKEN_KEY,
        }),
        expiresIn: new Date().setTime(new Date().getTime() + 20 * 1000),
      },
    };
  }

  // Method to initiate the password change (send OTP)
  async initiatePasswordChange(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Send OTP
    const otp = await this.mailService.sendOTP(email);

    return { message: 'OTP sent to your email', otp };
  }

  // Method to change the password
  async changePassword(changePasswordDetails: ChangePasswordParams) {
    const { newPassword, otp, email } = changePasswordDetails;

    // Find the user by email
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Validate OTP
    const isValidOtp = await this.mailService.validateOTP(email, otp);
    if (!isValidOtp) {
      throw new BadRequestException('Invalid OTP');
    }

    // Hash the new password
    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update the password
    user.password = hashedNewPassword;

    try {
      await this.userRepository.save(user);
      return { message: 'Password changed successfully' };
    } catch (error) {
      throw new InternalServerErrorException('Error updating the password');
    }
  }

  // Method to initiate the password change (send Link  )
  async initiatePasswordReset(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    console.log(user);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Send Link
    const link = await this.mailService.sendPasswordResetLink(email);

    return { message: 'Passord Reset Link sent to your email', link };
  }

  // forgot password
  async passwordReset(passwordResetDetails: PasswordResetParams) {
    const { newPassword, email } = passwordResetDetails;

    if (!newPassword) {
      throw new Error('New password is required');
    }

    // Find the user by email
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    console.log(passwordResetDetails);
    console.log(user);

    // Hash the new password
    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update the password
    user.password = hashedNewPassword;

    try {
      await this.userRepository.save(user);
      return { message: 'Password changed successfully' };
    } catch (error) {
      throw new InternalServerErrorException('Error updating the password');
    }
  }

  async googleLogin({
    email,
    name,
  }: {
    email: string;
    name: string;
  }): Promise<any> {
    const existingUser = await this.userRepository.findOneBy({ email });

    if (existingUser) {
      return existingUser;
    } else {
      const newUser = this.userRepository.create({
        name,
        email,
      });

      try {
        await this.userRepository.save(newUser);

        return newUser;
      } catch (error) {
        throw new InternalServerErrorException(
          'Something went wrong while saving the user',
        );
      }
    }
  }
}
