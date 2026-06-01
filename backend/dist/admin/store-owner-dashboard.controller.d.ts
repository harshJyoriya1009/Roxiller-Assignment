import { StoresService } from '../stores/stores.service';
import type { AuthenticatedUser } from '../common/types/authenticated-user.interface';
export declare class StoreOwnerDashboardController {
    private readonly storesService;
    constructor(storesService: StoresService);
    getDashboard(user: AuthenticatedUser): Promise<{
        store: {
            id: string;
            name: string;
            email: string;
            address: string;
        };
        averageRating: number;
        totalRatings: number;
        raters: {
            id: string;
            value: number;
            userName: string;
            userEmail: string;
            submittedAt: Date;
        }[];
    }>;
}
