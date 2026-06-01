import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserRole } from '../users/user.entity';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class RegisterDto {
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(16)
  @Matches(/^(?=.*[A-Z])(?=.*[\W]).+$/, {
    message:
      'Password must contain one uppercase letter and one special character',
  })
  password: string;

  @IsString()
  @MaxLength(200)
  address: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
