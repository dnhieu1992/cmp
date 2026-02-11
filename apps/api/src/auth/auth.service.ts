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
import { ConfigService } from '@nestjs/config';

const SALT_ROUNDS = 10;
const ACCESS_TOKEN_EXPIRES_IN = '30m';
const REFRESH_TOKEN_EXPIRES_IN = '7d';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
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
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const ok = await bcrypt.compare(loginDto.password, user.password_hash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    const tokens = await this.signTokens(user);
    await this.updateRefreshTokenHash(user.id, tokens.refresh_token);

    return {
      user: this.stripPassword(user),
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
    };
  }

  async refresh(refreshToken?: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is mission.');
    }

    const payload = await this.verifyRefreshToken(refreshToken);
    const user = await this.usersRepository.findOne({
      where: { id: payload.sub },
    });

    if (!user?.refresh_token_hash) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const isRefreshTokenValid = await bcrypt.compare(
      refreshToken,
      user.refresh_token_hash,
    );

    if (!isRefreshTokenValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const tokens = await this.signTokens(user);
    await this.updateRefreshTokenHash(user.id, tokens.refresh_token);

    return {
      user: this.stripPassword(user),
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
    };
  }

  async logout(refreshToken?: string) {
    if (!refreshToken) return;

    try {
      const payload = await this.verifyRefreshToken(refreshToken);
      await this.usersRepository.update(
        { id: payload.sub },
        { refresh_token_hash: null },
      );
    } catch {
      //
    }
  }

  private getRefreshSecret(): string {
    const refreshSecret =
      this.configService.get<string>('JWT_REFRESH_SECRET') ??
      this.configService.get<string>('JWT_SECRET');

    if (!refreshSecret) {
      throw new Error('JWT_REFRESH_SECRET or JWT_SECRET must be set');
    }

    return refreshSecret;
  }

  private async signTokens(user: User) {
    const payload = { sub: user.id, email: user.email };
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: ACCESS_TOKEN_EXPIRES_IN,
      }),
      this.jwtService.signAsync(payload, {
        secret: this.getRefreshSecret(),
        expiresIn: REFRESH_TOKEN_EXPIRES_IN,
      }),
    ]);

    return { access_token, refresh_token };
  }

  private async verifyRefreshToken(refreshToken: string) {
    try {
      return await this.jwtService.verifyAsync<{ sub: number; email: string }>(
        refreshToken,
        { secret: this.getRefreshSecret() },
      );
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private async updateRefreshTokenHash(userId: number, refreshToken: string) {
    const refresh_token_hash = await bcrypt.hash(refreshToken, SALT_ROUNDS);
    await this.usersRepository.update({ id: userId }, { refresh_token_hash });
  }
}
