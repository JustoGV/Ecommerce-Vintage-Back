import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from '../entities/product.entity';
import { Category } from '../entities/category.entity';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Category]),
    
  ],
  providers: [ProductsService],
  controllers: [ProductsController],
})
export class ProductsModule {}