import { Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { Role } from './entity/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RolePermission } from '../permission/entity/role_permission.entity';
import { Permission } from '../permission/entity/permission.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(RolePermission)
    private readonly rolePermissionRepository: Repository<RolePermission>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async findAll() {
    return this.roleRepository.find({ order: { created_at: 'DESC' } });
  }

  async assignPermissions(roleId: number, permissionIds: number[]) {
    await this.rolePermissionRepository.delete({ role: { id: roleId } });

    const permissions = await this.permissionRepository.findBy({
      id: In(permissionIds),
    });

    const rolePermissions = permissions.map((permission) =>
      this.rolePermissionRepository.create({
        role: { id: roleId } as Role,
        permission,
      }),
    );

    await this.rolePermissionRepository.save(rolePermissions);
  }
}
