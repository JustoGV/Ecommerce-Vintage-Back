import { MercadoPagoService } from '../mercadopago/mercadopago.service';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
export declare class CheckoutService {
    private readonly mercadoPagoService;
    constructor(mercadoPagoService: MercadoPagoService);
    createPreference(dto: CreateCheckoutDto): Promise<{
        id: string;
        url: string;
    }>;
}
