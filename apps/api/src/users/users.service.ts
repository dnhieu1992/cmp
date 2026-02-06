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
    return this.usersRepository.find({ order: { created_at: 'DESC' } });
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

  async updateRoles(userId: number, roleIds: string[]) {
    await this.userRolesRepository.delete({ user: { id: userId } });
    const roles = await this.roleRepository.findBy({ id: In(roleIds) });

    const userRoles = roles.map((role) =>
      this.userRolesRepository.create({
        user: { id: userId } as User,
        role,
      }),
    );

    return this.userRolesRepository.save(userRoles);
  }
}
