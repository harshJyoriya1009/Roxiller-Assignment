import { UserRole } from '../users/user.entity';
export declare class LoginDto {
    email: string;
    password: string;
}
export declare class RegisterDto {
    name: string;
    email: string;
    password: string;
    address: string;
    role?: UserRole;
}
