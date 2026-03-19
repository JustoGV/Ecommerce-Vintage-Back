import { Body, Controller, Post, Query } from '@nestjs/common';
import { MercadoPagoService } from '../mercadopago/mercadopago.service';
import { InjectRepository } from '@nestjs/typeorm';
import { CheckoutSession } from '../entities/checkout-session.entity';
import { Repository } from 'typeorm';
import { ProductsService } from '../products/products.service';

@Controller('webhooks/mercadopago')
export class MercadoPagoWebhooksController {
  constructor(
    private readonly mercadoPagoService: MercadoPagoService,
    private readonly productsService: ProductsService,
    @InjectRepository(CheckoutSession)
    private readonly checkoutRepository: Repository<CheckoutSession>,
  ) {}

  @Post()
  async handlePayment(@Body() body: any, @Query() query: any) {
    const paymentId =
      body?.data?.id ||
      body?.id ||
      body?.['data.id'] ||
      query?.['data.id'] ||
      query?.id;

    if (!paymentId) {
      return { received: true };
    }

    const accessToken = await this.mercadoPagoService.getAccessToken();
    const response = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!response.ok) {
      return { received: true };
    }

    const payment = (await response.json()) as {
      status?: string;
      preference_id?: string;
    };

    if (payment.status !== 'approved' || !payment.preference_id) {
      return { received: true };
    }

    const session = await this.checkoutRepository.findOne({
      where: { preferenceId: payment.preference_id },
    });

    if (!session || session.status === 'approved') {
      return { received: true };
    }

    await this.productsService.decrementStockForItems(session.items);

    session.status = 'approved';
    session.paymentId = String(paymentId);
    await this.checkoutRepository.save(session);

    return { received: true };
  }
}
