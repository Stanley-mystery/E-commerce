import { IsNumber } from 'class-validator';

export class CreateWishlistDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  productId: number;
}
