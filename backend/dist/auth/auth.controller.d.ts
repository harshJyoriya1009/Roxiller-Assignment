import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './auth.dto';
import type { AuthenticatedUser } from '../common/types/authenticated-user.interface';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(body: LoginDto): Promise<{
        access_token: string;
        user: {
            id: string;
            name: string;
            email: string;
            role: import("../users/user.entity").UserRole;
            address: string;
        };
    }>;
    register(body: RegisterDto): Promise<{
        id: string;
        name: string;
        email: string;
        address: string;
        role: import("../users/user.entity").UserRole;
        ratings: import("../ratings/rating.entity").Rating[];
        createdAt: Date;
        updatedAt: Date;
    }>;
    getProfile(user: AuthenticatedUser): {
        id: string;
        email: string;
        role: import("../users/user.entity").UserRole;
    };
}
