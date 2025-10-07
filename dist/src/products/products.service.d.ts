import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { Category } from '../entities/category.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductsService {
    private productsRepository;
    private categoriesRepository;
    constructor(productsRepository: Repository<Product>, categoriesRepository: Repository<Category>);
    create(createProductDto: CreateProductDto, imageUrl?: string): Promise<Product>;
    findAll(): Promise<Product[]>;
    findOne(id: string): Promise<Product>;
    update(id: string, updateProductDto: UpdateProductDto, imageUrl?: string): Promise<Product>;
    remove(id: string): Promise<void>;
    findByCategory(categoryId: string): Promise<Product[]>;
    search(query: string): Promise<Product[]>;
    addImageToProduct(productId: string, imageUrl: string): Promise<Product>;
    removeImageFromProduct(productId: string, imageUrl: string): Promise<Product>;
    reorderProductImages(productId: string, imageUrls: string[]): Promise<Product>;
}
