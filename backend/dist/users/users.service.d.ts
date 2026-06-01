import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';
import { CreateUserDto, UpdatePasswordDto, UserFilterDto } from './users.dto';
export declare class UsersService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    create(createUserDto: CreateUserDto): Promise<User>;
    findAll(filters: UserFilterDto): Promise<User[]>;
    findOne(id: string): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    updatePassword(userId: string, updatePasswordDto: UpdatePasswordDto): Promise<{
        message: string;
    }>;
    getTotalCount(): Promise<number>;
    getUsersByRole(role: UserRole): Promise<User[]>;
}
