import { StoresService } from './stores.service';
import { CreateStoreDto, StoreFilterDto } from './stores.dto';
import type { AuthenticatedUser } from '../common/types/authenticated-user.interface';
export declare class StoresController {
    private storesService;
    constructor(storesService: StoresService);
    createStore(body: CreateStoreDto): Promise<{
        message: string;
        data: import("./store.entity").Store;
    }>;
    getStores(query: StoreFilterDto, user: AuthenticatedUser): Promise<{
        id: string;
        name: string;
        email: string;
        address: string;
        ownerId: string;
        averageRating: number;
        totalRatings: number;
        userRating: number | null;
    }[]>;
    getStore(id: string): Promise<{
        averageRating: number;
        totalRatings: number;
        id: string;
        name: string;
        email: string;
        address: string;
        owner: import("../users/user.entity").User;
        ownerId: string;
        ratings: import("../ratings/rating.entity").Rating[];
        createdAt: Date;
        updatedAt: Date;
    }>;
}
