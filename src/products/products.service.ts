import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
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
    private dataSource: DataSource,
  ) {}

  async create(createProductDto: CreateProductDto, imageUrl?: string): Promise<Product> {
    const category = await this.categoriesRepository.findOne({
      where: { id: createProductDto.categoryId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // Preparar las URLs de imágenes
    let imageUrls: string[] = [];
    if (createProductDto.imageUrls && createProductDto.imageUrls.length > 0) {
      imageUrls = createProductDto.imageUrls;
    } else if (imageUrl) {
      imageUrls = [imageUrl]; // Para compatibilidad con el sistema actual
    }

    const product = this.productsRepository.create({
      ...createProductDto,
      category,
      imageUrls,
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

    // Excluir categoryId e imageUrls del assign ya que se manejan por separado
    const { categoryId, price, stock, imageUrls, ...updateData } = updateProductDto;

    // Convertir price y stock a number si existen
    if (price !== undefined && price !== null) {
      product.price = typeof price === 'string' ? parseFloat(price) : price;
    }
    if (stock !== undefined && stock !== null) {
      product.stock = typeof stock === 'string' ? parseInt(stock) : stock;
    }

    Object.assign(product, updateData);

    // Manejar las URLs de imágenes
    if (imageUrls && imageUrls.length > 0) {
      product.imageUrls = imageUrls;
    } else if (imageUrl) {
      // Para compatibilidad: si se pasa una sola imagen, agregarla al array
      if (!product.imageUrls) product.imageUrls = [];
      if (!product.imageUrls.includes(imageUrl)) {
        product.imageUrls.push(imageUrl);
      }
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

  async addImageToProduct(productId: string, imageUrl: string): Promise<Product> {
    const product = await this.findOne(productId);
    
    if (!product.imageUrls) {
      product.imageUrls = [];
    }
    
    if (!product.imageUrls.includes(imageUrl)) {
      product.imageUrls.push(imageUrl);
    }
    
    return this.productsRepository.save(product);
  }

  async removeImageFromProduct(productId: string, imageUrl: string): Promise<Product> {
    const product = await this.findOne(productId);
    
    if (product.imageUrls) {
      product.imageUrls = product.imageUrls.filter(url => url !== imageUrl);
    }
    
    return this.productsRepository.save(product);
  }

  async reorderProductImages(productId: string, imageUrls: string[]): Promise<Product> {
    const product = await this.findOne(productId);
    
    // Verificar que todas las URLs proporcionadas existen en el producto
    const validUrls = imageUrls.filter(url => 
      product.imageUrls && product.imageUrls.includes(url)
    );
    
    product.imageUrls = validUrls;
    return this.productsRepository.save(product);
  }

  async decrementStockForItems(
    items: Array<{ productId: string; quantity: number }>,
  ): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const item of items) {
        const product = await queryRunner.manager.findOne(Product, {
          where: { id: item.productId },
          lock: { mode: 'pessimistic_write' },
        });

        if (!product) {
          throw new NotFoundException('Product not found');
        }

        if (product.stock < item.quantity) {
          throw new BadRequestException('Insufficient stock');
        }

        product.stock -= item.quantity;
        await queryRunner.manager.save(product);
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}