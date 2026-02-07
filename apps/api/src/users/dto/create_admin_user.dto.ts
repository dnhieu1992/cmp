import {
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAdminUserDto {
  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  first_name?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  last_name?: string | null;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  roleId?: number | null;
}
