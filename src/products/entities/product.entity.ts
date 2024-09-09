import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ProductCategory } from 'src/product_category/entities/product_category.entity';
import { Wishlist } from 'src/wishlist/entities/wishlist.entity';
import { Cart } from 'src/cart/entities/cart.entity';

@Entity({ name: 'products' })
@Index('IDX_PRODUCT_NAME', ['name'])
@Index('IDX_PRODUCT_PRICE', ['price'])
export class Product {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ length: 150 })
  @IsString()
  @Length(1, 150)
  @IsNotEmpty()
  @Index({ unique: true })
  name: string;

  @Column('decimal')
  @IsNotEmpty()
  price: number;

  @Column({ type: 'text' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Column('simple-array', { nullable: true })
  imagePaths: string[];

  @OneToMany(
    () => ProductCategory,
    (productCategory) => productCategory.product,
    {
      cascade: ['remove'],
      onDelete: 'CASCADE',
    },
  )
  productCategories: ProductCategory[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.product, {
    cascade: ['remove'],
    onDelete: 'CASCADE',
  })
  wishlists: Wishlist[];

  @OneToMany(() => Cart, (cart) => cart.product)
  carts: Cart[];
}
