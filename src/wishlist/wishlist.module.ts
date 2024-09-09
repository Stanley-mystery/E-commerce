import { Module } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { WishlistController } from './wishlist.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { User } from 'src/users/entities/user.entitiy';
import { Product } from 'src/products/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Wishlist, User, Product])],
  controllers: [WishlistController],
  providers: [WishlistService],
  exports: [TypeOrmModule],
})
export class WishlistModule {}
