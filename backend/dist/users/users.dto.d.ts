import { UserRole } from './user.entity';
export declare class CreateUserDto {
    name: string;
    email: string;
    password: string;
    address?: string;
    role?: UserRole;
}
export declare class UpdatePasswordDto {
    currentPassword: string;
    newPassword: string;
}
export declare class UserFilterDto {
    name?: string;
    email?: string;
    address?: string;
    role?: UserRole;
    sortBy?: string;
    sortOrder?: string;
}
