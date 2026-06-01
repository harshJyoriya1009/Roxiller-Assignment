import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rating } from './rating.entity';
import { CreateRatingDto, UpdateRatingDto } from './ratings.dto';

@Injectable()
export class RatingsService {
  constructor(
    @InjectRepository(Rating)
    private ratingsRepository: Repository<Rating>,
  ) {}

  async create(
    userId: string,
    createRatingDto: CreateRatingDto,
  ): Promise<Rating> {
    const existingRating = await this.ratingsRepository.findOne({
      where: { userId, storeId: createRatingDto.storeId },
    });
    if (existingRating) {
      throw new ConflictException(
        'You have already rated this store. Please update your existing rating.',
      );
    }

    const rating = this.ratingsRepository.create({
      userId,
      storeId: createRatingDto.storeId,
      value: createRatingDto.value,
    });
    return this.ratingsRepository.save(rating);
  }

  async update(
    userId: string,
    ratingId: string,
    updateRatingDto: UpdateRatingDto,
  ): Promise<Rating> {
    const rating = await this.ratingsRepository.findOne({
      where: { id: ratingId },
    });
    if (!rating) {
      throw new NotFoundException('Rating not found');
    }
    if (rating.userId !== userId) {
      throw new ForbiddenException("Cannot update another user's rating");
    }

    rating.value = updateRatingDto.value;
    return this.ratingsRepository.save(rating);
  }

  async findByStore(storeId: string): Promise<Rating[]> {
    return this.ratingsRepository.find({
      where: { storeId },
      relations: { user: true },
    });
  }

  async getTotalCount(): Promise<number> {
    return this.ratingsRepository.count();
  }

  async getStoreRatingStats(
    storeId: string,
  ): Promise<{ average: number; total: number }> {
    const ratings = await this.ratingsRepository.find({ where: { storeId } });
    const total = ratings.length;
    let totalScore = 0;

    for (const rating of ratings) {
      totalScore += rating.value;
    }

    const average = total > 0 ? Math.round((totalScore / total) * 10) / 10 : 0;
    return { average, total };
  }
}
