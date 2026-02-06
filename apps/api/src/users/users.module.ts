import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '../roles/entity/role.entity';
import { UserRole } from '../roles/entity/user_role.entity';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Permission } from '../permission/entity/permission.entity';
import { Session } from '../permission/entity/session.entity';
import { RolePermission } from '../permission/entity/role_permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Role,
      UserRole,
      Permission,
      Session,
      RolePermission,
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
