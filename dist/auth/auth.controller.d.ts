import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(loginDto: {
        email: string;
        password: string;
    }): Promise<{
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            role: import("../entities/user.entity").UserRole;
            createdAt: Date;
            updatedAt: Date;
        };
        message: string;
    }>;
    register(createUserDto: CreateUserDto): Promise<{
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            role: import("../entities/user.entity").UserRole;
            createdAt: Date;
            updatedAt: Date;
        };
        message: string;
    }>;
}
