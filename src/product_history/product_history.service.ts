import { Injectable } from '@nestjs/common';
import { CreateProductHistoryDto } from './dto/create-product_history.dto';
import { UpdateProductHistoryDto } from './dto/update-product_history.dto';

@Injectable()
export class ProductHistoryService {
  create(createProductHistoryDto: CreateProductHistoryDto) {
    return 'This action adds a new productHistory';
  }

  findAll() {
    return `This action returns all productHistory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} productHistory`;
  }

  update(id: number, updateProductHistoryDto: UpdateProductHistoryDto) {
    return `This action updates a #${id} productHistory`;
  }

  remove(id: number) {
    return `This action removes a #${id} productHistory`;
  }
}
