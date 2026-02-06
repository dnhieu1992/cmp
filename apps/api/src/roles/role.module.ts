import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entity/role.entity';
import { Permission } from 'src/permission/entity/permission.entity';
import { RolePermission } from 'src/permission/entity/role_permission.entity';
import { RoleService } from './role.service';

@Module({
  imports: [TypeOrmModule.forFeature([Role, Permission, RolePermission])],
  controllers: [],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
