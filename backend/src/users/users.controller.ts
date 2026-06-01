import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateUserDto, UpdatePasswordDto, UserFilterDto } from './users.dto';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';

import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

import { UserRole } from './user.entity';
import type { AuthenticatedUser } from '../common/types/authenticated-user.interface';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('register')
  @Roles(UserRole.ADMIN)
  async registerUser(@Body() body: CreateUserDto) {
    const user = await this.usersService.create(body);

    return {
      message: 'User created successfully',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  @Get()
  @Roles(UserRole.ADMIN)
  async getAllUsers(@Query() query: UserFilterDto) {
    const users = await this.usersService.findAll(query);

    return users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    }));
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  async getUserById(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }

  @Put('update-password')
  async updatePassword(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: UpdatePasswordDto,
  ) {
    await this.usersService.updatePassword(user.id, body);

    return {
      message: 'Password updated successfully',
    };
  }
}
