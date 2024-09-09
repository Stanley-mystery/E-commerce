import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './users/entities/user.entitiy';

import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
// import { MailModule } from './mail/mail.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MailModule } from './mail/mail.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductHistoryModule } from './product_history/product_history.module';

import { Product } from './products/entities/product.entity';

import { ProductCategoryModule } from './product_category/product_category.module';
import { ProductCategory } from './product_category/entities/product_category.entity';
import { Category } from './categories/entities/category.entity';
import { WishlistModule } from './wishlist/wishlist.module';
import { Wishlist } from './wishlist/entities/wishlist.entity';
import { CartModule } from './cart/cart.module';
import { Cart } from './cart/entities/cart.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: +process.env.DATABASE_PORT,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [User, Product, Wishlist, Category, ProductCategory, Cart],
      synchronize: true,
      // logging: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60m' },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'images'),
      serveRoot: '/images',
    }),

    UsersModule,
    AuthModule,
    MailModule,
    ProductsModule,
    CategoriesModule,
    ProductHistoryModule,
    WishlistModule,
    ProductCategoryModule,
    WishlistModule,
    CartModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}
