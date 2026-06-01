import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateUserDto, UserFilterDto } from '../users/users.dto';
import { CreateStoreDto, StoreFilterDto } from '../stores/stores.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/user.entity';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  getDashboard() {
    return this.adminService.getDashboardStats();
  }

  @Post('users')
  async createUser(@Body() createUserDto: CreateUserDto) {
    const user = await this.adminService.createUser(createUserDto);
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      address: user.address,
      role: user.role,
      ratings: user.ratings,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  @Post('stores')
  createStore(@Body() createStoreDto: CreateStoreDto) {
    return this.adminService.createStore(createStoreDto);
  }

  @Get('users')
  async getUsers(@Query() filterDto: UserFilterDto) {
    const users = await this.adminService.getUsers(filterDto);
    return users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      address: user.address,
      role: user.role,
      ratings: user.ratings,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));
  }

  @Get('stores')
  getStores(@Query() filterDto: StoreFilterDto) {
    return this.adminService.getStores(filterDto);
  }

  @Get('users/:id')
  getUserDetails(@Param('id') id: string) {
    return this.adminService.getUserDetails(id);
  }
}
