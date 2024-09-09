import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ProductCategory } from 'src/product_category/entities/product_category.entity';
import { ProductCategory as ProductCategoryEnum } from '../categories.enum'; // Enum import for category types
import { IsNotEmpty } from 'class-validator';

@Entity({ name: 'categories' })
@Index('IDX_CATEGORY_NAME', ['name']) // Updated index for category name
export class Category {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({
    type: 'enum',
    enum: ProductCategoryEnum, // Enum for category type
  })
  @IsNotEmpty()
  name: ProductCategoryEnum; // Enum value for name

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  // Relation with ProductCategory entity
  @OneToMany(
    () => ProductCategory,
    (productCategory) => productCategory.category,
    {
      cascade: ['remove'],
      onDelete: 'CASCADE',
    },
  )
  productCategories: ProductCategory[];
}
