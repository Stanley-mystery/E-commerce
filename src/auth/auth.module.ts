import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entitiy';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  JwtAuthStrategy,
  RefreshJwtStrategy,
  LocalStrategy,
} from './strategies';

import { PassportModule } from '@nestjs/passport';
import { MailService } from 'src/mail/mail.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      secret: `${process.env.JWT_SECRET}`,
      signOptions: { expiresIn: '60s' },
    }),
    TypeOrmModule.forFeature([User]),
    PassportModule,
  ],

  providers: [
    AuthService,
    LocalStrategy,
    JwtAuthStrategy,
    RefreshJwtStrategy,
    MailService,
  ],
  controllers: [AuthController],
  exports: [JwtModule],
})
export class AuthModule {}
