import { MercadoPagoService } from '../mercadopago/mercadopago.service';
import { CheckoutSession } from '../entities/checkout-session.entity';
import { Repository } from 'typeorm';
import { ProductsService } from '../products/products.service';
export declare class MercadoPagoWebhooksController {
    private readonly mercadoPagoService;
    private readonly productsService;
    private readonly checkoutRepository;
    constructor(mercadoPagoService: MercadoPagoService, productsService: ProductsService, checkoutRepository: Repository<CheckoutSession>);
    handlePayment(body: any, query: any): Promise<{
        received: boolean;
    }>;
}
