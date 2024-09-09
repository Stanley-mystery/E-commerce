import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Cart } from './entities/cart.entity';
import { User } from 'src/users/entities/user.entitiy';
import { Product } from 'src/products/entities/product.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private cartRepository: Repository<Cart>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Product) private productRepository: Repository<Product>,
  ) {}

  // Create a new cart for a user
  async create(createCartDto: CreateCartDto): Promise<Cart> {
    const { userId, productId } = createCartDto;

    const user = await this.userRepository.findOne({ where: { id: userId } });
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (!user || !product) {
      throw new Error('User or Product not found');
    }

    const cart = this.cartRepository.create({ user, product });
    return await this.cartRepository.save(cart);
  }

  // Find all carts for a user
  async findAll(): Promise<Cart[]> {
    return this.cartRepository.find({ relations: ['user', 'product'] });
  }

  // Find one cart by cart ID
  async findOne(id: number): Promise<Cart> {
    return this.cartRepository.findOne({
      where: { id },
      relations: ['user', 'product'],
    });
  }

  // Update a cart's products or other fields
  async update(id: number, updateCartDto: UpdateCartDto): Promise<Cart> {
    const cart = await this.cartRepository.findOne({ where: { id } });
    if (!cart) {
      throw new NotFoundException(`Cart with ID ${id} not found`);
    }

    const updatedWishlist = { ...cart, ...updateCartDto };
    return this.cartRepository.save(updatedWishlist);
  }

  // Remove a cart
  async remove(id: number): Promise<void> {
    return this.cartRepository.delete(id).then(() => undefined);
  }
}
