import { IsUrl, IsArray } from 'class-validator';

export class AddImageDto {
  @IsUrl()
  imageUrl: string;
}

export class RemoveImageDto {
  @IsUrl()
  imageUrl: string;
}

export class ReorderImagesDto {
  @IsArray()
  @IsUrl({}, { each: true })
  imageUrls: string[];
}
