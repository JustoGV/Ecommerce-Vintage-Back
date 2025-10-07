import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { Category } from '../../entities/category.entity';
import { Product } from '../../entities/product.entity';
export declare class SeedService {
    private usersRepository;
    private categoriesRepository;
    private productsRepository;
    constructor(usersRepository: Repository<User>, categoriesRepository: Repository<Category>, productsRepository: Repository<Product>);
    seed(): Promise<void>;
    private createUser;
    private createCategories;
    private createProducts;
}
