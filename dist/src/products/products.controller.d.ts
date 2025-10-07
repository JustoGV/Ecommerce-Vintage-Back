import 'dotenv/config';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AddImageDto, RemoveImageDto, ReorderImagesDto } from './dto/image-management.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    create(createProductDto: CreateProductDto): Promise<import("../entities/product.entity").Product>;
    findAll(): Promise<import("../entities/product.entity").Product[]>;
    search(query: string): Promise<import("../entities/product.entity").Product[]>;
    findByCategory(categoryId: string): Promise<import("../entities/product.entity").Product[]>;
    findOne(id: string): Promise<import("../entities/product.entity").Product>;
    update(id: string, updateProductDto: UpdateProductDto): Promise<import("../entities/product.entity").Product>;
    remove(id: string): Promise<void>;
    addImage(id: string, addImageDto: AddImageDto): Promise<import("../entities/product.entity").Product>;
    removeImage(id: string, removeImageDto: RemoveImageDto): Promise<import("../entities/product.entity").Product>;
    reorderImages(id: string, reorderImagesDto: ReorderImagesDto): Promise<import("../entities/product.entity").Product>;
}
