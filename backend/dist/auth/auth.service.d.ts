import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto, RegisterDto } from './auth.dto';
import { UserRole } from '../users/user.entity';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: string;
            name: string;
            email: string;
            role: UserRole;
            address: string;
        };
    }>;
    register(registerDto: RegisterDto): Promise<{
        id: string;
        name: string;
        email: string;
        address: string;
        role: UserRole;
        ratings: import("../ratings/rating.entity").Rating[];
        createdAt: Date;
        updatedAt: Date;
    }>;
}
