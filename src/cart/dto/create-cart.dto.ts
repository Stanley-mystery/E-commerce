import { IsNumber } from 'class-validator';

export class CreateCartDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  productId: number;
}
