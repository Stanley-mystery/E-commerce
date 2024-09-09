import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entitiy';
import { UpdateUserDto } from './dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRespository: Repository<User>,
  ) {}

  // findOne
  async findOne(id: number) {
    const user = await this.userRespository.findOne({
      where: { id },
      relations: ['wishlists', 'wishlists.product'],
    });

    return user;
  }

  // update a user
  async updateUser(
    id: number,
    updateUserdetails: UpdateUserDto,
  ): Promise<User> {
    const user = await this.userRespository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, updateUserdetails);
    await this.userRespository.save(user);
    return user;
  }

  // delete a user by id
  async deleteUser(id: number): Promise<void> {
    const result = await this.userRespository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  // // update image
  async uploadUserImageById(
    id: number,
    imagePath: Express.Multer.File,
  ): Promise<User> {
    const user = await this.userRespository.findOne({
      where: { id },
    });

    if (!user) {
      throw new Error('User not found');
    }

    user.imagePath = imagePath.filename;

    await this.userRespository.save(user);

    const baseUrl = 'http://localhost:3001/images/';
    user.imagePath = `${baseUrl}${imagePath}`;

    return user;
  }
}
