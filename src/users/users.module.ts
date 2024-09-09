import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entitiy';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, JwtService],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}
