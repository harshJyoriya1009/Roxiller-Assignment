import { User } from '../users/user.entity';
import { Store } from '../stores/store.entity';
export declare class Rating {
    id: string;
    value: number;
    user: User;
    userId: string;
    store: Store;
    storeId: string;
    createdAt: Date;
    updatedAt: Date;
}
