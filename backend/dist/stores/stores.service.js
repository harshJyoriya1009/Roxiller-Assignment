"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoresService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const store_entity_1 = require("./store.entity");
let StoresService = class StoresService {
    storeRepository;
    constructor(storeRepository) {
        this.storeRepository = storeRepository;
    }
    async create(createStoreDto) {
        const existingStore = await this.storeRepository.findOne({
            where: { email: createStoreDto.email },
        });
        if (existingStore) {
            throw new common_1.ConflictException('Store already exists');
        }
        return this.storeRepository.save(this.storeRepository.create(createStoreDto));
    }
    async findAll(filters, userId) {
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
            const userRating = store.ratings.find((rating) => rating.userId === userId);
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
    async findOne(id) {
        const store = await this.storeRepository.findOne({
            where: { id },
            relations: {
                ratings: true,
                owner: true,
            },
        });
        if (!store) {
            throw new common_1.NotFoundException('Store not found');
        }
        return store;
    }
    async findByOwner(ownerId) {
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
    async getStoreWithStats(id) {
        const store = await this.findOne(id);
        const totalRatings = store.ratings.length;
        let totalScore = 0;
        for (const rating of store.ratings) {
            totalScore += rating.value;
        }
        return {
            ...store,
            averageRating: Number((totalRatings > 0 ? totalScore / totalRatings : 0).toFixed(1)),
            totalRatings,
        };
    }
};
exports.StoresService = StoresService;
exports.StoresService = StoresService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(store_entity_1.Store)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], StoresService);
//# sourceMappingURL=stores.service.js.map