import { IsString, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';
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
  @IsNumber()
  @Min(0)
  stock?: number;

  @IsUUID()
  categoryId: string;

  @IsOptional()
  image?: any; // Puede ser File, Buffer, o string según cómo lo recibas
}