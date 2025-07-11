import 'dotenv/config'; // <-- Añade esto en la primera línea
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Query
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

// Cloudinary setup
const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    console.log('Create product:', createProductDto);
    return this.productsService.create(createProductDto, createProductDto.image);
  }



  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get('search')
  search(@Query('q') query: string) {
    return this.productsService.search(query);
  }

  @Get('category/:categoryId')
  findByCategory(@Param('categoryId') categoryId: string) {
    return this.productsService.findByCategory(categoryId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    console.log('Update product:', { id, updateProductDto });
    return this.productsService.update(id, updateProductDto, updateProductDto.image);
  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}