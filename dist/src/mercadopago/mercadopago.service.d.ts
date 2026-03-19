import { Repository } from 'typeorm';
import { MercadoPagoConfig } from '../entities/mercadopago-config.entity';
import { User } from '../entities/user.entity';
import { UpdateMercadoPagoConfigDto } from './dto/update-mercadopago-config.dto';
export declare class MercadoPagoService {
    private readonly configRepository;
    private readonly usersRepository;
    constructor(configRepository: Repository<MercadoPagoConfig>, usersRepository: Repository<User>);
    private getAdminUser;
    private findActiveConfig;
    getAdminConfig(): Promise<{
        accessToken: string;
        publicKey: string;
    }>;
    getPublicConfig(): Promise<{
        publicKey: string;
    }>;
    getAccessToken(): Promise<string>;
    saveConfig(dto: UpdateMercadoPagoConfigDto): Promise<{
        accessToken: string;
        publicKey: string;
    }>;
}
