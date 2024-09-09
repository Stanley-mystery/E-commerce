import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { User } from 'src/users/entities/user.entitiy';
import { Wishlist } from './entities/wishlist.entity';
import { Product } from 'src/products/entities/product.entity';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  // Create a new wishlist entry
  async create(createWishlistDto: CreateWishlistDto): Promise<Wishlist> {
    const { userId, productId } = createWishlistDto;

    const user = await this.userRepository.findOne({ where: { id: userId } });
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!user || !product) {
      throw new Error('User or Product not found');
    }

    const wishlist = this.wishlistRepository.create({
      user,
      product,
    });

    return this.wishlistRepository.save(wishlist);
  }

  // Get all wishlists
  findAll(): Promise<Wishlist[]> {
    return this.wishlistRepository.find({ relations: ['user', 'product'] });
  }

  // Get a specific wishlist by ID
  findOne(id: number): Promise<Wishlist> {
    return this.wishlistRepository.findOne({
      where: { id },
      relations: ['user', 'product'],
    });
  }

  // Update wishlist entry
  async update(
    id: number,
    updateWishlistDto: UpdateWishlistDto,
  ): Promise<Wishlist> {
    const wishlist = await this.wishlistRepository.findOne({ where: { id } });

    if (!wishlist) {
      throw new Error(`Wishlist #${id} not found`);
    }

    const updatedWishlist = { ...wishlist, ...updateWishlistDto };
    return this.wishlistRepository.save(updatedWishlist);
  }

  // Remove a wishlist entry
  remove(id: number): Promise<void> {
    return this.wishlistRepository.delete(id).then(() => undefined);
  }
}
