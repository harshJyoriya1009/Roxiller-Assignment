import { Rating } from '../ratings/rating.entity';
export declare enum UserRole {
    USER = "user",
    ADMIN = "admin",
    STORE_OWNER = "store_owner"
}
export declare class User {
    id: string;
    name: string;
    email: string;
    password: string;
    address: string;
    role: UserRole;
    ratings: Rating[];
    createdAt: Date;
    updatedAt: Date;
}
