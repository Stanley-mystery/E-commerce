import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { Cart } from './entities/cart.entity';
import { User } from 'src/users/entities/user.entitiy';
import { Product } from 'src/products/entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, User, Product])],
  controllers: [CartController],
  providers: [CartService],
  exports: [TypeOrmModule],
})
export class CartModule {}
