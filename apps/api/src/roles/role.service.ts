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
    const roles = await this.roleRepository.find({
      order: { created_at: 'DESC' },
      relations: { rolePermissions: { permission: true } },
    });

    return roles.map((role) => {
      const permissions =
        role.rolePermissions?.map((rp) => rp.permission.code) ?? [];
      const { rolePermissions, ...rest } = role as any;
      return { ...rest, permissions };
    });
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
