import { Body, Controller, Get, Put } from '@nestjs/common';
import { MercadoPagoService } from './mercadopago.service';
import { UpdateMercadoPagoConfigDto } from './dto/update-mercadopago-config.dto';

@Controller('mercadopago')
export class MercadoPagoController {
  constructor(private readonly mercadoPagoService: MercadoPagoService) {}

  @Get('public-key')
  getPublicKey() {
    return this.mercadoPagoService.getPublicConfig();
  }

  @Get('config')
  getAdminConfig() {
    return this.mercadoPagoService.getAdminConfig();
  }

  @Put('config')
  saveConfig(@Body() dto: UpdateMercadoPagoConfigDto) {
    return this.mercadoPagoService.saveConfig(dto);
  }
}
