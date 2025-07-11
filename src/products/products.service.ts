import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { Category } from '../entities/category.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async create(createProductDto: CreateProductDto, imageUrl?: string): Promise<Product> {
    const category = await this.categoriesRepository.findOne({
      where: { id: createProductDto.categoryId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const product = this.productsRepository.create({
      ...createProductDto,
      category,
      imageUrl,
    });

    return this.productsRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return this.productsRepository.find({
      relations: ['category'],
      where: { isActive: true },
    });
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto, imageUrl?: string): Promise<Product> {
    const product = await this.findOne(id);
    console.log('Update product:', { id, updateProductDto, imageUrl });

    if (updateProductDto.categoryId && updateProductDto.categoryId !== product.category?.id) {
      const category = await this.categoriesRepository.findOne({
        where: { id: updateProductDto.categoryId },
      });

      if (!category) {
        throw new NotFoundException('Category not found');
      }

      product.category = category;
    }

    // Excluir categoryId del assign ya que se maneja por separado
    const { categoryId, price, stock, ...updateData } = updateProductDto;

    // Convertir price y stock a number si existen
    if (price !== undefined && price !== null) {
      product.price = typeof price === 'string' ? parseFloat(price) : price;
    }
    if (stock !== undefined && stock !== null) {
      product.stock = typeof stock === 'string' ? parseInt(stock) : stock;
    }

    Object.assign(product, updateData);

    if (imageUrl) {
      product.imageUrl = imageUrl;
    }

    return this.productsRepository.save(product);
  }

  async remove(id: string): Promise<void> {
    const product = await this.findOne(id);
    product.isActive = false;
    await this.productsRepository.save(product);
  }

  async findByCategory(categoryId: string): Promise<Product[]> {
    return this.productsRepository.find({
      where: { category: { id: categoryId }, isActive: true },
      relations: ['category'],
    });
  }

  async search(query: string): Promise<Product[]> {
    return this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .where('product.isActive = :isActive', { isActive: true })
      .andWhere(
        '(LOWER(product.title) LIKE LOWER(:query) OR LOWER(product.description) LIKE LOWER(:query))',
        { query: `%${query}%` }
      )
      .getMany();
  }
}