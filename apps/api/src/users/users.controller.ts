import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';
import { User } from './user.entity';
import { UpdateUserRolesDto } from './dto/update_user_roles.dto';

@ApiTags('users')
@ApiBearerAuth()
@ApiCookieAuth('access_token')
@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'List users' })
  @ApiOkResponse({ description: 'List of users' })
  findAll() {
    return this.usersService.findAll();
  }

  @Put(':id/roles')
  @ApiOperation({ summary: 'Update user roles' })
  @ApiOkResponse({ description: 'User roles updated' })
  updateRoles(@Param('id') id: string, @Body() body: UpdateUserRolesDto) {
    return this.usersService.updateRoles(Number(id), body.roleIds);
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current user' })
  @ApiOkResponse({ description: 'Current user' })
  me(@Req() req: Request & { user: User }) {
    return this.usersService.findByEmail(req.user.email);
  }
}
