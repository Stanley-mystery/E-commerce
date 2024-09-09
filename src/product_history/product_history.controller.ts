import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductHistoryService } from './product_history.service';
import { CreateProductHistoryDto } from './dto/create-product_history.dto';
import { UpdateProductHistoryDto } from './dto/update-product_history.dto';

@Controller('product-history')
export class ProductHistoryController {
  constructor(private readonly productHistoryService: ProductHistoryService) {}

  @Post()
  create(@Body() createProductHistoryDto: CreateProductHistoryDto) {
    return this.productHistoryService.create(createProductHistoryDto);
  }

  @Get()
  findAll() {
    return this.productHistoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productHistoryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductHistoryDto: UpdateProductHistoryDto) {
    return this.productHistoryService.update(+id, updateProductHistoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productHistoryService.remove(+id);
  }
}
