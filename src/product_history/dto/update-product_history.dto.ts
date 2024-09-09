import { PartialType } from '@nestjs/mapped-types';
import { CreateProductHistoryDto } from './create-product_history.dto';

export class UpdateProductHistoryDto extends PartialType(CreateProductHistoryDto) {}
