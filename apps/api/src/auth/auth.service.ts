import * as bcrypt from 'bcrypt';
import {
  UnauthorizedException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';

const SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  findAll() {
    return this.usersRepository.find({ order: { created_at: 'DESC' } });
  }

  private stripPassword(user: User) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password_hash, ...rest } = user;
    return rest;
  }

  async register(registerDto: RegisterDto) {
    const isExists = await this.usersService.findByEmail(registerDto.email);
    if (isExists) throw new ConflictException('Email already exists');

    const password_hash = await bcrypt.hash(registerDto.password, SALT_ROUNDS);
    const user = await this.usersService.create({
      email: registerDto.email,
      password_hash,
    });
    return this.stripPassword(user);
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    console.log('user', user, loginDto);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const ok = await bcrypt.compare(loginDto.password, user.password_hash);
    console.log('ok', ok);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    const token = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
    });
    return { user: this.stripPassword(user), access_token: token };
  }
}
