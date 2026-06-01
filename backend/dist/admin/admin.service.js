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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const stores_service_1 = require("../stores/stores.service");
const ratings_service_1 = require("../ratings/ratings.service");
const user_entity_1 = require("../users/user.entity");
let AdminService = class AdminService {
    usersService;
    storesService;
    ratingsService;
    constructor(usersService, storesService, ratingsService) {
        this.usersService = usersService;
        this.storesService = storesService;
        this.ratingsService = ratingsService;
    }
    async getDashboardStats() {
        const [totalUsers, totalStores, totalRatings] = await Promise.all([
            this.usersService.getTotalCount(),
            this.storesService.getTotalCount(),
            this.ratingsService.getTotalCount(),
        ]);
        return { totalUsers, totalStores, totalRatings };
    }
    async createUser(createUserDto) {
        return this.usersService.create(createUserDto);
    }
    async createStore(createStoreDto) {
        return this.storesService.create(createStoreDto);
    }
    async getUsers(filterDto) {
        return this.usersService.findAll(filterDto);
    }
    async getStores(filterDto) {
        return this.storesService.findAll(filterDto);
    }
    async getUserDetails(id) {
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
        if (user.role === user_entity_1.UserRole.STORE_OWNER) {
            const store = await this.storesService.findByOwner(id);
            if (store) {
                const stats = await this.ratingsService.getStoreRatingStats(store.id);
                return { ...result, store: { ...store, ...stats } };
            }
        }
        return result;
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        stores_service_1.StoresService,
        ratings_service_1.RatingsService])
], AdminService);
//# sourceMappingURL=admin.service.js.map