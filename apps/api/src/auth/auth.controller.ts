import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import type { Request, Response } from 'express';

type RequestWithCookies = Request & {
  cookies: Record<string, string | undefined>;
};

const ACCESS_TOKEN_COOKIE = 'access_token';
const REFRESH_TOKEN_COOKIE = 'refresh_token';
const ACCESS_TOKEN_COOKIE_MAX_AGE_MS = 1000 * 60 * 30;
const REFRESH_TOKEN_COOKIE_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 7;

const buildCookieOptions = (maxAge: number) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge,
});

@ApiTags('auth')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private setAuthCookies(
    res: Response,
    accessToken: string,
    refreshToken: string,
  ) {
    res.cookie(
      ACCESS_TOKEN_COOKIE,
      accessToken,
      buildCookieOptions(ACCESS_TOKEN_COOKIE_MAX_AGE_MS),
    );

    res.cookie(
      REFRESH_TOKEN_COOKIE,
      refreshToken,
      buildCookieOptions(REFRESH_TOKEN_COOKIE_MAX_AGE_MS),
    );
  }

  private clearAuthCookies(res: Response) {
    res.clearCookie(ACCESS_TOKEN_COOKIE);
    res.clearCookie(REFRESH_TOKEN_COOKIE);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register' })
  @ApiBody({ type: RegisterDto })
  @ApiOkResponse({ description: 'Registered user' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login' })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ description: 'Login result (sets access_token cookie)' })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token, refresh_token, user } =
      await this.authService.login(dto);

    this.setAuthCookies(res, access_token, refresh_token);

    return { user };
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout' })
  @ApiOkResponse({ description: 'Clears access_token cookie' })
  async logout(
    @Req() req: RequestWithCookies,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies.refresh_token;
    await this.authService.logout(refreshToken);
    this.clearAuthCookies(res);
    return { ok: true };
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiOkResponse({
    description: 'Sets new access_token + refresh_token cookies',
  })
  async refresh(
    @Req() req: RequestWithCookies,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies.refresh_token;

    const { access_token, refresh_token, user } =
      await this.authService.refresh(refreshToken);

    this.setAuthCookies(res, access_token, refresh_token);
    return { user };
  }
}
