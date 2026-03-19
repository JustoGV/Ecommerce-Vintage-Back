import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MercadoPagoService } from '../mercadopago/mercadopago.service';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
import { CheckoutSession } from '../entities/checkout-session.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CheckoutService {
  constructor(
    private readonly mercadoPagoService: MercadoPagoService,
    @InjectRepository(CheckoutSession)
    private readonly checkoutRepository: Repository<CheckoutSession>,
  ) {}

  async createPreference(dto: CreateCheckoutDto) {
    const accessToken = await this.mercadoPagoService.getAccessToken();

    const payload: Record<string, unknown> = {
      items: dto.items.map((item) => ({
        title: item.title,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        currency_id: item.currencyId || 'ARS',
        description: item.description,
        picture_url: item.pictureUrl,
      })),
    };

    if (dto.payer) {
      payload.payer = dto.payer;
    }

    if (dto.externalReference) {
      payload.external_reference = dto.externalReference;
    }

    if (dto.notificationUrl) {
      payload.notification_url = dto.notificationUrl;
    }

    const response = await fetch(
      'https://api.mercadopago.com/checkout/preferences',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      },
    );

    if (!response.ok) {
      const errorBody = await response.text();
      throw new InternalServerErrorException(
        `Mercado Pago error: ${response.status} ${errorBody}`,
      );
    }

    const data = (await response.json()) as {
      id: string;
      init_point?: string;
      sandbox_init_point?: string;
    };

    await this.checkoutRepository.save({
      preferenceId: data.id,
      items: dto.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      status: 'pending',
    });

    return {
      id: data.id,
      url: data.init_point || data.sandbox_init_point,
    };
  }
}
