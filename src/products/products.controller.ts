import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  Request,
  Put,
  UploadedFiles,
} from '@nestjs/common';
import { ProductService } from './products.service';
import { CreateProductDto, ProductQueryDto } from './dto/product.dto';
import { saveImageToStorage } from 'src/helpers/imageStorage.helper';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Product } from './entities/product.entity';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get('/:id')
  getProduct(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Get()
  getAllProducts() {
    return this.productsService.findAll();
  }

  @Put('/:id/upload')
  @UseInterceptors(FilesInterceptor('files', 10, saveImageToStorage)) // Allow up to 10 images
  async uploadImages(
    @Param('id') id: number,
    @UploadedFiles() files: Express.Multer.File[], // Array of files
    @Request() req,
  ): Promise<Product> {
    const productId = +req.params.id;

    const product = await this.productsService.uploadBookImagesById(
      productId,
      files,
    );

    const baseUrl = 'http://localhost:3001/images/';
    product.imagePaths = product.imagePaths.map((path) => `${baseUrl}${path}`);
    console.log(product.imagePaths);

    return product;
  }
}
