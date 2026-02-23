import { IsString, IsNumber, IsOptional, IsUUID, Min, IsArray, IsUrl, IsIn } from 'class-validator';
import { Column } from 'typeorm';

export class CreateProductDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  @Column({ nullable: true }) // Agrega nullable
  price: number;

  @IsOptional()
  @IsString()
  @IsIn(['ARS', 'USD'])
  currency?: 'ARS' | 'USD';

  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;

  @IsUUID()
  categoryId: string;

  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  imageUrls?: string[];

  @IsOptional()
  image?: any; // Para compatibilidad con el sistema actual de upload
}