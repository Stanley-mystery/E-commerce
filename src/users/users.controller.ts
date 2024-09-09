import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entitiy';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { UpdateUserDto } from './dto';
import { JwtGuard } from 'src/auth/guards';
import { saveImageToStorage } from 'src/helpers/imageStorage.helper';
import { join } from 'path';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  readonly BASE_URL = 'http://localhost:3001/images/';

  // get user by id
  // @UseGuards(JwtGuard)
  @Get('/:id')
  getUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  // updateUser
  @Put('/:id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.updateUser(id, updateUserDto);
  }

  //  delete a user
  @Delete('/:id')
  async deleteUser(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.userService.deleteUser(id);
  }

  // update user image
  @Put('/:id/upload')
  @UseInterceptors(FileInterceptor('file', saveImageToStorage))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ): Promise<User> {
    const userId = +req.params.id;

    const user = await this.userService.uploadUserImageById(userId, file);

    const imageUrl = `${this.BASE_URL}${user.imagePath}`;
    user.imagePath = imageUrl;
    return user;
  }
}
