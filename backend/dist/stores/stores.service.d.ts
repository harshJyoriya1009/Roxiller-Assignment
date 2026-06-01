import { Repository } from 'typeorm';
import { Store } from './store.entity';
import { CreateStoreDto, StoreFilterDto } from './stores.dto';
export declare class StoresService {
    private readonly storeRepository;
    constructor(storeRepository: Repository<Store>);
    create(createStoreDto: CreateStoreDto): Promise<Store>;
    findAll(filters: StoreFilterDto, userId?: string): Promise<{
        id: string;
        name: string;
        email: string;
        address: string;
        ownerId: string;
        averageRating: number;
        totalRatings: number;
        userRating: number | null;
    }[]>;
    findOne(id: string): Promise<Store>;
    findByOwner(ownerId: string): Promise<Store | null>;
    getTotalCount(): Promise<number>;
    getStoreWithStats(id: string): Promise<{
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
