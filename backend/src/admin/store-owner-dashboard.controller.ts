import { Controller, Get, UseGuards } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { StoresService } from '../stores/stores.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../common/types/authenticated-user.interface';
import { UserRole } from '../users/user.entity';

@Controller('store-owner')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.STORE_OWNER)
export class StoreOwnerDashboardController {
  constructor(private readonly storesService: StoresService) {}

  @Get('dashboard')
  async getDashboard(@CurrentUser() user: AuthenticatedUser) {
    const store = await this.storesService.findByOwner(user.id);
    if (!store)
      throw new NotFoundException('No store associated with this account');

    const ratings = store.ratings || [];
    const avgRating =
      ratings.length > 0
        ? Math.round(
            (ratings.reduce((s, r) => s + r.value, 0) / ratings.length) * 10,
          ) / 10
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
}
