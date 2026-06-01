import { AdminService } from './admin.service';
import { CreateUserDto, UserFilterDto } from '../users/users.dto';
import { CreateStoreDto, StoreFilterDto } from '../stores/stores.dto';
import { UserRole } from '../users/user.entity';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getDashboard(): Promise<{
        totalUsers: number;
        totalStores: number;
        totalRatings: number;
    }>;
    createUser(createUserDto: CreateUserDto): Promise<{
        id: string;
        name: string;
        email: string;
        address: string;
        role: UserRole;
        ratings: import("../ratings/rating.entity").Rating[];
        createdAt: Date;
        updatedAt: Date;
    }>;
    createStore(createStoreDto: CreateStoreDto): Promise<import("../stores/store.entity").Store>;
    getUsers(filterDto: UserFilterDto): Promise<{
        id: string;
        name: string;
        email: string;
        address: string;
        role: UserRole;
        ratings: import("../ratings/rating.entity").Rating[];
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getStores(filterDto: StoreFilterDto): Promise<{
        id: string;
        name: string;
        email: string;
        address: string;
        ownerId: string;
        averageRating: number;
        totalRatings: number;
        userRating: number | null;
    }[]>;
    getUserDetails(id: string): Promise<{
        id: string;
        name: string;
        email: string;
        address: string | null;
        role: UserRole;
        ratings: unknown[];
        createdAt: Date;
        updatedAt: Date;
    } & {
        store?: import("../stores/store.entity").Store & {
            average: number;
            total: number;
        };
    }>;
}
