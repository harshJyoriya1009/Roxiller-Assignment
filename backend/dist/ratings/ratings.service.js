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
exports.RatingsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const rating_entity_1 = require("./rating.entity");
let RatingsService = class RatingsService {
    ratingsRepository;
    constructor(ratingsRepository) {
        this.ratingsRepository = ratingsRepository;
    }
    async create(userId, createRatingDto) {
        const existingRating = await this.ratingsRepository.findOne({
            where: { userId, storeId: createRatingDto.storeId },
        });
        if (existingRating) {
            throw new common_1.ConflictException('You have already rated this store. Please update your existing rating.');
        }
        const rating = this.ratingsRepository.create({
            userId,
            storeId: createRatingDto.storeId,
            value: createRatingDto.value,
        });
        return this.ratingsRepository.save(rating);
    }
    async update(userId, ratingId, updateRatingDto) {
        const rating = await this.ratingsRepository.findOne({
            where: { id: ratingId },
        });
        if (!rating) {
            throw new common_1.NotFoundException('Rating not found');
        }
        if (rating.userId !== userId) {
            throw new common_1.ForbiddenException("Cannot update another user's rating");
        }
        rating.value = updateRatingDto.value;
        return this.ratingsRepository.save(rating);
    }
    async findByStore(storeId) {
        return this.ratingsRepository.find({
            where: { storeId },
            relations: { user: true },
        });
    }
    async getTotalCount() {
        return this.ratingsRepository.count();
    }
    async getStoreRatingStats(storeId) {
        const ratings = await this.ratingsRepository.find({ where: { storeId } });
        const total = ratings.length;
        let totalScore = 0;
        for (const rating of ratings) {
            totalScore += rating.value;
        }
        const average = total > 0 ? Math.round((totalScore / total) * 10) / 10 : 0;
        return { average, total };
    }
};
exports.RatingsService = RatingsService;
exports.RatingsService = RatingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(rating_entity_1.Rating)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], RatingsService);
//# sourceMappingURL=ratings.service.js.map