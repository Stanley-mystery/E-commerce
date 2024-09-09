import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/product.dto';
import { Category } from '../categories/entities/category.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
  ) {}

  // Create a new product
  async create(createProductDto: CreateProductDto): Promise<Product> {
    const { name, price, description } = createProductDto;

    const product = this.productRepository.create({ name, price, description });

    return this.productRepository.save(product);
  }

  async findOne(id: number): Promise<Product> {
    if (!id || id <= 0) {
      throw new BadRequestException('Invalid book ID');
    }
    const product = this.productRepository.findOne({
      where: { id },
      relations: [
        'productCategories',
        'productCategories.category',
        'wishlists',
      ],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    const baseUrl = 'http://localhost:3001/images/';
    (await product).imagePaths = (await product).imagePaths.map(
      (path) => `${baseUrl}${path}`,
    );

    return product;
  }

  async findAll(
    page: number = 1,
    limit: number = 30,
  ): Promise<{ products: Product[]; total: number }> {
    try {
      if (page <= 0 || limit <= 0) {
        throw new BadRequestException(
          'Page and limit must be positive numbers',
        );
      }

      const offset = (page - 1) * limit;

      // Fetch products with count
      const [products, total] = await this.productRepository.findAndCount({
        skip: offset,
        take: limit,
        relations: ['productCategories', 'productCategories.category'],
      });

      // Base URL for images
      const baseUrl = 'http://localhost:3001/images/';

      // Map image paths to include base URL
      products.forEach((product) => {
        product.imagePaths = product.imagePaths.map(
          (path) => `${baseUrl}${path}`,
        );
      });

      return { products, total };
    } catch (error) {
      // Log the error for debugging
      console.error('Error fetching products:', error);
      throw new InternalServerErrorException('Failed to retrieve products');
    }
  }

  async uploadBookImagesById(
    id: number,
    imagePaths: Express.Multer.File[],
  ): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const fileNames = imagePaths.map((file) => file.filename);

    if (Array.isArray(product.imagePaths)) {
      product.imagePaths = [...product.imagePaths, ...fileNames];
    } else {
      product.imagePaths = fileNames;
    }

    await this.productRepository.save(product);

    return product;
  }
}
