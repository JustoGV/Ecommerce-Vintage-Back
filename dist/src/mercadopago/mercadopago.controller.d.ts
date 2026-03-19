import { MercadoPagoService } from './mercadopago.service';
import { UpdateMercadoPagoConfigDto } from './dto/update-mercadopago-config.dto';
export declare class MercadoPagoController {
    private readonly mercadoPagoService;
    constructor(mercadoPagoService: MercadoPagoService);
    getPublicKey(): Promise<{
        publicKey: string;
    }>;
    getAdminConfig(): Promise<{
        accessToken: string;
        publicKey: string;
    }>;
    saveConfig(dto: UpdateMercadoPagoConfigDto): Promise<{
        accessToken: string;
        publicKey: string;
    }>;
}
