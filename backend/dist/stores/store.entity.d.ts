import { Rating } from '../ratings/rating.entity';
import { User } from '../users/user.entity';
export declare class Store {
    id: string;
    name: string;
    email: string;
    address: string;
    owner: User;
    ownerId: string;
    ratings: Rating[];
    createdAt: Date;
    updatedAt: Date;
}
