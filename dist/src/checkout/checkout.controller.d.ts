import { CheckoutService } from './checkout.service';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
export declare class CheckoutController {
    private readonly checkoutService;
    constructor(checkoutService: CheckoutService);
    createPreference(dto: CreateCheckoutDto): Promise<{
        id: string;
        url: string;
    }>;
}
