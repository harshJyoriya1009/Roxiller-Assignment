export declare class CreateStoreDto {
    name: string;
    email: string;
    address?: string;
    ownerId?: string;
}
export declare class StoreFilterDto {
    name?: string;
    address?: string;
    sortBy?: string;
    sortOrder?: string;
}
