import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcryptjs';

import { User, UserRole } from './user.entity';
import { CreateUserDto, UpdatePasswordDto, UserFilterDto } from './users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return await this.userRepository.save(user);
  }

  async findAll(filters: UserFilterDto) {
    const query = this.userRepository.createQueryBuilder('user');

    if (filters.name) {
      query.andWhere('user.name ILIKE :name', {
        name: `%${filters.name}%`,
      });
    }

    if (filters.email) {
      query.andWhere('user.email ILIKE :email', {
        email: `%${filters.email}%`,
      });
    }

    if (filters.role) {
      query.andWhere('user.role = :role', {
        role: filters.role,
      });
    }

    query.orderBy('user.createdAt', 'DESC');

    return await query.getMany();
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: {
        ratings: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOne({
      where: { email },
    });
  }

  async updatePassword(userId: string, updatePasswordDto: UpdatePasswordDto) {
    const user = await this.findOne(userId);

    const isPasswordCorrect = await bcrypt.compare(
      updatePasswordDto.currentPassword,
      user.password,
    );

    if (!isPasswordCorrect) {
      throw new UnauthorizedException('Wrong current password');
    }

    const newHashedPassword = await bcrypt.hash(
      updatePasswordDto.newPassword,
      10,
    );

    user.password = newHashedPassword;

    await this.userRepository.save(user);

    return {
      message: 'Password updated',
    };
  }

  async getTotalCount() {
    return await this.userRepository.count();
  }

  async getUsersByRole(role: UserRole) {
    return await this.userRepository.find({
      where: { role },
    });
  }
}
