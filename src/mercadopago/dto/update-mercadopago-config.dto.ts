import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateMercadoPagoConfigDto {
  @IsString()
  @IsNotEmpty()
  accessToken: string;

  @IsString()
  @IsNotEmpty()
  publicKey: string;
}
