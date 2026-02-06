import { Type } from 'class-transformer';
import { ArrayUnique, IsArray, IsInt } from 'class-validator';

export class UpdateUserRolesDto {
  @IsArray()
  @ArrayUnique()
  @Type(() => Number)
  @IsInt({ each: true })
  roleIds!: number[];
}
