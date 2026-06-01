import { RatingsService } from './ratings.service';
import { CreateRatingDto, UpdateRatingDto } from './ratings.dto';
import type { AuthenticatedUser } from '../common/types/authenticated-user.interface';
export declare class RatingsController {
    private readonly ratingsService;
    constructor(ratingsService: RatingsService);
    create(user: AuthenticatedUser, createRatingDto: CreateRatingDto): Promise<import("./rating.entity").Rating>;
    update(user: AuthenticatedUser, id: string, updateRatingDto: UpdateRatingDto): Promise<import("./rating.entity").Rating>;
}
