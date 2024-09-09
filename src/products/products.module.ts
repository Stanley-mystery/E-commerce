import { Module } from '@nestjs/common';

import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';

import { ProductService } from './products.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [ProductsController],
  providers: [ProductService],
  exports: [TypeOrmModule],
})
export class ProductsModule {}
