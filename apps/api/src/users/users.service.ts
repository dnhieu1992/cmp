import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create_user.dto';
import { UserRole } from '../roles/entity/user_role.entity';
import { Role } from '../roles/entity/role.entity';
import * as bcrypt from 'bcrypt';
import { CreateAdminUserDto } from './dto/create_admin_user.dto';
import { UpdateAdminUserDto } from './dto/update_admin_user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(UserRole)
    private readonly userRolesRepository: Repository<UserRole>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async findAll() {
    const users = await this.usersRepository.find({
      order: { created_at: 'DESC' },
      relations: { userRoles: { role: true } },
    });

    return users.map((user) => {
      const roles = user.userRoles?.map((ur) => ur.role) ?? [];
      const { userRoles, password_hash, ...rest } = user;
      return { ...rest, roles };
    });
  }

  async findByEmail(email: string) {
    return this.usersRepository.findOne({ where: { email } });
  }

  async create(userDto: CreateUserDto) {
    const user = this.usersRepository.create({
      email: userDto.email,
      password_hash: userDto.password_hash,
    });

    return this.usersRepository.save(user);
  }

  async createAdminUser(dto: CreateAdminUserDto) {
    const exists = await this.usersRepository.findOne({
      where: { email: dto.email },
    });
    if (exists) throw new BadRequestException('Email already exists');

    const tempPassword = 'Pass@word1';
    const password_hash = await bcrypt.hash(tempPassword, 10);

    const user = this.usersRepository.create({
      email: dto.email,
      first_name: dto.first_name ?? null,
      last_name: dto.last_name ?? null,
      password_hash,
    });

    const saved = await this.usersRepository.save(user);

    if (dto.roleId) {
      await this.updateRoles(saved.id, [dto.roleId]);
    }

    const { password_hash: _, ...publicUser } = saved;
    // TODO: deliver temp password via email in real applications.
    return { user: publicUser, tempPassword };
  }

  async updateAdminUser(userId: number, dto: UpdateAdminUserDto) {
    return this.dataSource.transaction(async (manager) => {
      const userRepo = manager.getRepository(User);
      const roleRepo = manager.getRepository(Role);
      const userRoleRepo = manager.getRepository(UserRole);

      const user = await userRepo.findOne({ where: { id: userId } });
      if (!user) throw new NotFoundException('User not found');

      if (dto.email && dto.email !== user.email) {
        const exists = await userRepo.findOne({ where: { email: dto.email } });
        if (exists) throw new BadRequestException('Email already exists');
        user.email = dto.email;
      }

      if (dto.first_name !== undefined) user.first_name = dto.first_name;
      if (dto.last_name !== undefined) user.last_name = dto.last_name;

      const saved = await userRepo.save(user);

      if (dto.roleId !== undefined) {
        await userRoleRepo.delete({ user: { id: userId } });

        if (dto.roleId) {
          const role = await roleRepo.findOne({ where: { id: dto.roleId } });
          if (!role) throw new BadRequestException('Role not found');
          await userRoleRepo.save(
            userRoleRepo.create({
              user: { id: userId } as User,
              role,
            }),
          );
        }
      }

      const withRoles = await userRepo.findOne({
        where: { id: userId },
        relations: { userRoles: { role: true } },
      });

      const roles = withRoles?.userRoles?.map((ur) => ur.role) ?? [];
      const source = withRoles ?? saved;
      const { userRoles, password_hash, ...rest } = source as any;
      return { user: { ...rest, roles } };
    });
  }

  async hardDelete(userId: number) {
    return this.dataSource.transaction(async (manager) => {
      const userRepo = manager.getRepository(User);

      const user = await userRepo.findOne({ where: { id: userId } });
      if (!user) throw new NotFoundException('User not found');

      // Clean up dependent rows first to avoid FK violations.
      await manager
        .createQueryBuilder()
        .delete()
        .from('user_roles')
        .where('userId = :userId', { userId })
        .execute();

      // Sessions table name is `session` (if present).
      await manager
        .createQueryBuilder()
        .delete()
        .from('session')
        .where('userId = :userId', { userId })
        .execute();

      await userRepo.delete({ id: userId });
      return { ok: true };
    });
  }

  async updateRoles(userId: number, roleIds: number[]) {
    const ids = Array.isArray(roleIds) ? roleIds : [];

    await this.userRolesRepository.delete({ user: { id: userId } });

    // Allow clearing roles with an empty list.
    if (ids.length === 0) return [];

    const roles = await this.roleRepository.findBy({ id: In(ids) });

    const userRoles = roles.map((role) =>
      this.userRolesRepository.create({
        user: { id: userId } as User,
        role,
      }),
    );

    return this.userRolesRepository.save(userRoles);
  }
}
