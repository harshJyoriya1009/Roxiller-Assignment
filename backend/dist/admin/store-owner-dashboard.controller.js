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
exports.StoreOwnerDashboardController = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const stores_service_1 = require("../stores/stores.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const user_entity_1 = require("../users/user.entity");
let StoreOwnerDashboardController = class StoreOwnerDashboardController {
    storesService;
    constructor(storesService) {
        this.storesService = storesService;
    }
    async getDashboard(user) {
        const store = await this.storesService.findByOwner(user.id);
        if (!store)
            throw new common_2.NotFoundException('No store associated with this account');
        const ratings = store.ratings || [];
        const avgRating = ratings.length > 0
            ? Math.round((ratings.reduce((s, r) => s + r.value, 0) / ratings.length) * 10) / 10
            : 0;
        const raters = ratings.map((r) => ({
            id: r.id,
            value: r.value,
            userName: r.user?.name || 'Unknown',
            userEmail: r.user?.email || '',
            submittedAt: r.createdAt,
        }));
        return {
            store: {
                id: store.id,
                name: store.name,
                email: store.email,
                address: store.address,
            },
            averageRating: avgRating,
            totalRatings: ratings.length,
            raters,
        };
    }
};
exports.StoreOwnerDashboardController = StoreOwnerDashboardController;
__decorate([
    (0, common_1.Get)('dashboard'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StoreOwnerDashboardController.prototype, "getDashboard", null);
exports.StoreOwnerDashboardController = StoreOwnerDashboardController = __decorate([
    (0, common_1.Controller)('store-owner'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.STORE_OWNER),
    __metadata("design:paramtypes", [stores_service_1.StoresService])
], StoreOwnerDashboardController);
//# sourceMappingURL=store-owner-dashboard.controller.js.map