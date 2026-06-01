import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

import { Transform } from 'class-transformer';
import { UserRole } from './user.entity';

const trimTransform = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(16)
  @Matches(/^(?=.*[A-Z])(?=.*[\W]).+$/, {
    message:
      'Password must contain one uppercase letter and one special character',
  })
  password!: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  address?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}

export class UpdatePasswordDto {
  @IsString()
  currentPassword!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(16)
  @Matches(/^(?=.*[A-Z])(?=.*[\W]).+$/, {
    message:
      'Password must contain one uppercase letter and one special character',
  })
  newPassword!: string;
}

export class UserFilterDto {
  @IsOptional()
  @Transform(trimTransform)
  @IsString()
  name?: string;

  @IsOptional()
  @Transform(trimTransform)
  @IsString()
  email?: string;

  @IsOptional()
  @Transform(trimTransform)
  @IsString()
  address?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsString()
  sortOrder?: string;
}
