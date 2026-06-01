import { Controller, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { CreateRatingDto, UpdateRatingDto } from './ratings.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../users/user.entity';
import type { AuthenticatedUser } from '../common/types/authenticated-user.interface';

@Controller('ratings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @Post()
  @Roles(UserRole.USER)
  async create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() createRatingDto: CreateRatingDto,
  ) {
    return this.ratingsService.create(user.id, createRatingDto);
  }

  @Put(':id')
  @Roles(UserRole.USER)
  async update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() updateRatingDto: UpdateRatingDto,
  ) {
    return this.ratingsService.update(user.id, id, updateRatingDto);
  }
}
