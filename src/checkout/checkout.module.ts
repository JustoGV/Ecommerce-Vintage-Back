import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckoutController } from './checkout.controller';
import { CheckoutService } from './checkout.service';
import { MercadoPagoModule } from '../mercadopago/mercadopago.module';
import { CheckoutSession } from '../entities/checkout-session.entity';
import { MercadoPagoWebhooksController } from './webhooks.controller';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [MercadoPagoModule, ProductsModule, TypeOrmModule.forFeature([CheckoutSession])],
  controllers: [CheckoutController, MercadoPagoWebhooksController],
  providers: [CheckoutService],
})
export class CheckoutModule {}
