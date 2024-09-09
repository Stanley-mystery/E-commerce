import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { Product } from 'src/products/entities/product.entity';

@Entity('product_category')
export class ProductCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, (product) => product.productCategories)
  @JoinColumn()
  product: Product;

  @ManyToOne(() => Category, (category) => category.productCategories)
  @JoinColumn()
  category: Category;
}
