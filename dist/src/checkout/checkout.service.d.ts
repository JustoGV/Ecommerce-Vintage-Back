import { MercadoPagoService } from '../mercadopago/mercadopago.service';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
import { CheckoutSession } from '../entities/checkout-session.entity';
import { Repository } from 'typeorm';
export declare class CheckoutService {
    private readonly mercadoPagoService;
    private readonly checkoutRepository;
    constructor(mercadoPagoService: MercadoPagoService, checkoutRepository: Repository<CheckoutSession>);
    createPreference(dto: CreateCheckoutDto): Promise<{
        id: string;
        url: string;
    }>;
}
