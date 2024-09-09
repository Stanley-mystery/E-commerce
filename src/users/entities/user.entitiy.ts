import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { Exclude } from 'class-transformer';
import { Wishlist } from 'src/wishlist/entities/wishlist.entity';
import { Cart } from 'src/cart/entities/cart.entity';

@Entity({ name: 'users' })
@Index('IDX_USER_NAME', ['name'])
@Index('IDX_USER_EMAIL', ['email'])
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ length: 150 })
  @IsString()
  @IsNotEmpty()
  @Length(3, 150)
  name: string;

  @Column({ length: 150 })
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  email: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  @Length(8, 500)
  @Exclude()
  password: string;

  @Column({ nullable: true })
  imagePath?: string;

  @Column({ nullable: true })
  otp: string;

  @Column({ type: 'timestamp', nullable: true })
  otpExpiresAt: Date;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @OneToMany(() => Wishlist, (wishlist) => wishlist.user)
  wishlists: Wishlist[];

  @OneToMany(() => Cart, (cart) => cart.user)
  carts: Cart[];

  // one to many relationship between user and book_history
  // @OneToMany(() => Book_history, (book_history) => book_history.users, {
  //   cascade: ['remove'],
  //   onDelete: 'CASCADE',
  // })
  // bookHistories: Book_history[];

  // // one to many relationship between books and book_history
  // @OneToMany(() => Review, (review) => review.users, {
  //   cascade: ['remove'],
  //   onDelete: 'CASCADE',
  // })
  // reviews: Review[];
}
