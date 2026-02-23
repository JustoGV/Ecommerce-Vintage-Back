import { CreateProductDto } from './create-product.dto';
declare const UpdateProductDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateProductDto>>;
export declare class UpdateProductDto extends UpdateProductDto_base {
    categoryId?: string;
    isActive?: boolean;
    currency?: 'ARS' | 'USD';
}
export {};
