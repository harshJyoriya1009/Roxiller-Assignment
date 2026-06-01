import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Store } from './store.entity';
import { CreateStoreDto, StoreFilterDto } from './stores.dto';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
  ) {}

  async create(createStoreDto: CreateStoreDto) {
    const existingStore = await this.storeRepository.findOne({
      where: { email: createStoreDto.email },
    });

    if (existingStore) {
      throw new ConflictException('Store already exists');
    }

    return this.storeRepository.save(
      this.storeRepository.create(createStoreDto),
    );
  }

  async findAll(filters: StoreFilterDto, userId?: string) {
    const storeQuery = this.storeRepository
      .createQueryBuilder('store')
      .leftJoinAndSelect('store.ratings', 'ratings');

    if (filters.name) {
      storeQuery.andWhere('store.name ILIKE :name', {
        name: `%${filters.name}%`,
      });
    }

    if (filters.address) {
      storeQuery.andWhere('store.address ILIKE :address', {
        address: `%${filters.address}%`,
      });
    }

    storeQuery.orderBy('store.createdAt', 'DESC');

    const stores = await storeQuery.getMany();

    return stores.map((store) => {
      const totalRatings = store.ratings.length;
      let totalScore = 0;

      for (const rating of store.ratings) {
        totalScore += rating.value;
      }

      const averageRating = totalRatings > 0 ? totalScore / totalRatings : 0;
      const userRating = store.ratings.find(
        (rating) => rating.userId === userId,
      );

      return {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        ownerId: store.ownerId,
        averageRating: Number(averageRating.toFixed(1)),
        totalRatings,
        userRating: userRating ? userRating.value : null,
      };
    });
  }

  async findOne(id: string) {
    const store = await this.storeRepository.findOne({
      where: { id },
      relations: {
        ratings: true,
        owner: true,
      },
    });

    if (!store) {
      throw new NotFoundException('Store not found');
    }

    return store;
  }

  async findByOwner(ownerId: string) {
    return this.storeRepository.findOne({
      where: { ownerId },
      relations: {
        ratings: true,
      },
    });
  }

  async getTotalCount() {
    return this.storeRepository.count();
  }

  async getStoreWithStats(id: string) {
    const store = await this.findOne(id);

    const totalRatings = store.ratings.length;
    let totalScore = 0;

    for (const rating of store.ratings) {
      totalScore += rating.value;
    }

    return {
      ...store,
      averageRating: Number(
        (totalRatings > 0 ? totalScore / totalRatings : 0).toFixed(1),
      ),
      totalRatings,
    };
  }
}
