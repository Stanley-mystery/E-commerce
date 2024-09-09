import { Module } from '@nestjs/common';
import { ProductHistoryService } from './product_history.service';
import { ProductHistoryController } from './product_history.controller';

@Module({
  controllers: [ProductHistoryController],
  providers: [ProductHistoryService],
})
export class ProductHistoryModule {}
