import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { StoresService } from './stores.service';
import { CreateStoreDto, StoreFilterDto } from './stores.dto';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';

import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

import { UserRole } from '../users/user.entity';
import type { AuthenticatedUser } from '../common/types/authenticated-user.interface';

@Controller('stores')
@UseGuards(JwtAuthGuard)
export class StoresController {
  constructor(private storesService: StoresService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async createStore(@Body() body: CreateStoreDto) {
    const store = await this.storesService.create(body);

    return {
      message: 'Store created successfully',
      data: store,
    };
  }

  @Get()
  async getStores(
    @Query() query: StoreFilterDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return await this.storesService.findAll(query, user.id);
  }

  @Get(':id')
  async getStore(@Param('id') id: string) {
    return await this.storesService.getStoreWithStats(id);
  }
}
