import { User } from './user.entity';
export declare class MercadoPagoConfig {
    id: string;
    accessToken: string;
    publicKey: string;
    isActive: boolean;
    adminUser: User;
    createdAt: Date;
    updatedAt: Date;
}
