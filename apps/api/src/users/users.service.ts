import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create_user.dto';
import { UserRole } from '../roles/entity/user_role.entity';
import { Role } from '../roles/entity/role.entity';

@Injectable()
export class UsersService {
  constructor(
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
      const { userRoles, ...rest } = user;
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
