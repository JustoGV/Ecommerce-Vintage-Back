import { Category } from './category.entity';
export declare class Product {
    id: string;
    title: string;
    description: string;
    price: number;
    imageUrls: string[];
    stock: number;
    isActive: boolean;
    category: Category;
    createdAt: Date;
    updatedAt: Date;
}
