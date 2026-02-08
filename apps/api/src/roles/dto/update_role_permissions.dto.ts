import { ArrayUnique, IsArray, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateRolePermissionsDto {
  @IsArray()
  @ArrayUnique()
  @Type(() => Number)
  @IsInt({ each: true })
  permissionIds!: number[];
}
