"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("../entities/product.entity");
const category_entity_1 = require("../entities/category.entity");
let ProductsService = class ProductsService {
    constructor(productsRepository, categoriesRepository) {
        this.productsRepository = productsRepository;
        this.categoriesRepository = categoriesRepository;
    }
    async create(createProductDto, imageUrl) {
        const category = await this.categoriesRepository.findOne({
            where: { id: createProductDto.categoryId },
        });
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        const product = this.productsRepository.create({
            ...createProductDto,
            category,
            imageUrl,
        });
        return this.productsRepository.save(product);
    }
    async findAll() {
        return this.productsRepository.find({
            relations: ['category'],
            where: { isActive: true },
        });
    }
    async findOne(id) {
        const product = await this.productsRepository.findOne({
            where: { id },
            relations: ['category'],
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        return product;
    }
    async update(id, updateProductDto, imageUrl) {
        const product = await this.findOne(id);
        console.log('Update product:', { id, updateProductDto, imageUrl });
        if (updateProductDto.categoryId && updateProductDto.categoryId !== product.category?.id) {
            const category = await this.categoriesRepository.findOne({
                where: { id: updateProductDto.categoryId },
            });
            if (!category) {
                throw new common_1.NotFoundException('Category not found');
            }
            product.category = category;
        }
        const { categoryId, price, stock, ...updateData } = updateProductDto;
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
    async remove(id) {
        const product = await this.findOne(id);
        product.isActive = false;
        await this.productsRepository.save(product);
    }
    async findByCategory(categoryId) {
        return this.productsRepository.find({
            where: { category: { id: categoryId }, isActive: true },
            relations: ['category'],
        });
    }
    async search(query) {
        return this.productsRepository
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.category', 'category')
            .where('product.isActive = :isActive', { isActive: true })
            .andWhere('(LOWER(product.title) LIKE LOWER(:query) OR LOWER(product.description) LIKE LOWER(:query))', { query: `%${query}%` })
            .getMany();
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(1, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ProductsService);
//# sourceMappingURL=products.service.js.map