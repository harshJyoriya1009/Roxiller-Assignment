import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { StoresService } from '../stores/stores.service';
import { RatingsService } from '../ratings/ratings.service';
import { CreateUserDto, UserFilterDto } from '../users/users.dto';
import { CreateStoreDto, StoreFilterDto } from '../stores/stores.dto';
import { UserRole } from '../users/user.entity';
import { Store } from '../stores/store.entity';

type PublicUser = {
  id: string;
  name: string;
  email: string;
  address: string | null;
  role: UserRole;
  ratings: unknown[];
  createdAt: Date;
  updatedAt: Date;
};

type StoreOwnerUserDetails = PublicUser & {
  store?: Store & { average: number; total: number };
};

@Injectable()
export class AdminService {
  constructor(
    private usersService: UsersService,
    private storesService: StoresService,
    private ratingsService: RatingsService,
  ) {}

  async getDashboardStats() {
    const [totalUsers, totalStores, totalRatings] = await Promise.all([
      this.usersService.getTotalCount(),
      this.storesService.getTotalCount(),
      this.ratingsService.getTotalCount(),
    ]);
    return { totalUsers, totalStores, totalRatings };
  }

  async createUser(createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  async createStore(createStoreDto: CreateStoreDto) {
    return this.storesService.create(createStoreDto);
  }

  async getUsers(filterDto: UserFilterDto) {
    return this.usersService.findAll(filterDto);
  }

  async getStores(filterDto: StoreFilterDto) {
    return this.storesService.findAll(filterDto);
  }

  async getUserDetails(id: string): Promise<StoreOwnerUserDetails> {
    const user = await this.usersService.findOne(id);
    const result = {
      id: user.id,
      name: user.name,
      email: user.email,
      address: user.address,
      role: user.role,
      ratings: user.ratings,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    if (user.role === UserRole.STORE_OWNER) {
      const store = await this.storesService.findByOwner(id);
      if (store) {
        const stats = await this.ratingsService.getStoreRatingStats(store.id);
        return { ...result, store: { ...store, ...stats } };
      }
    }
    return result;
  }
}
