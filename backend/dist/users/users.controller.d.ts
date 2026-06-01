import { UsersService } from './users.service';
import { CreateUserDto, UpdatePasswordDto, UserFilterDto } from './users.dto';
import { UserRole } from './user.entity';
import type { AuthenticatedUser } from '../common/types/authenticated-user.interface';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    registerUser(body: CreateUserDto): Promise<{
        message: string;
        data: {
            id: string;
            name: string;
            email: string;
            role: UserRole;
        };
    }>;
    getAllUsers(query: UserFilterDto): Promise<{
        id: string;
        name: string;
        email: string;
        role: UserRole;
    }[]>;
    getUserById(id: string): Promise<{
        id: string;
        name: string;
        email: string;
        role: UserRole;
    }>;
    updatePassword(user: AuthenticatedUser, body: UpdatePasswordDto): Promise<{
        message: string;
    }>;
}
