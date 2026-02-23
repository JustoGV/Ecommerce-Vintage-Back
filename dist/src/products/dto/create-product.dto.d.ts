export declare class CreateProductDto {
    title: string;
    description: string;
    price: number;
    currency?: 'ARS' | 'USD';
    stock?: number;
    categoryId: string;
    imageUrls?: string[];
    image?: any;
}
