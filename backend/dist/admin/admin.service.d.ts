import { UsersService } from '../users/users.service';
import { StoresService } from '../stores/stores.service';
import { RatingsService } from '../ratings/ratings.service';
import { CreateUserDto, UserFilterDto } from '../users/users.dto';
import { CreateStoreDto, StoreFilterDto } from '../stores/stores.dto';
import { UserRole } from '../users/user.entity';
import { Store } from '../stores/store.entity';
type PublicUser = {
    id: string;
    name: string;
    email: string;
    address: string | null;
    role: UserRole;
    ratings: unknown[];
    createdAt: Date;
    updatedAt: Date;
};
type StoreOwnerUserDetails = PublicUser & {
    store?: Store & {
        average: number;
        total: number;
    };
};
export declare class AdminService {
    private usersService;
    private storesService;
    private ratingsService;
    constructor(usersService: UsersService, storesService: StoresService, ratingsService: RatingsService);
    getDashboardStats(): Promise<{
        totalUsers: number;
        totalStores: number;
        totalRatings: number;
    }>;
    createUser(createUserDto: CreateUserDto): Promise<import("../users/user.entity").User>;
    createStore(createStoreDto: CreateStoreDto): Promise<Store>;
    getUsers(filterDto: UserFilterDto): Promise<import("../users/user.entity").User[]>;
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
    getUserDetails(id: string): Promise<StoreOwnerUserDetails>;
}
export {};
