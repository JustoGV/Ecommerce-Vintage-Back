import { UsersService } from '../users/users.service';
export declare class AuthService {
    private usersService;
    constructor(usersService: UsersService);
    login(email: string, password: string): Promise<{
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
    register(userData: any): Promise<{
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
    validateUser(email: string, password: string): Promise<any>;
}
