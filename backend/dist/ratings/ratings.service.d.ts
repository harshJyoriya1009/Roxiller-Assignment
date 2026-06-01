import { Repository } from 'typeorm';
import { Rating } from './rating.entity';
import { CreateRatingDto, UpdateRatingDto } from './ratings.dto';
export declare class RatingsService {
    private ratingsRepository;
    constructor(ratingsRepository: Repository<Rating>);
    create(userId: string, createRatingDto: CreateRatingDto): Promise<Rating>;
    update(userId: string, ratingId: string, updateRatingDto: UpdateRatingDto): Promise<Rating>;
    findByStore(storeId: string): Promise<Rating[]>;
    getTotalCount(): Promise<number>;
    getStoreRatingStats(storeId: string): Promise<{
        average: number;
        total: number;
    }>;
}
