import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RoleService } from './role.service';

@ApiTags('roles')
@ApiBearerAuth()
@ApiCookieAuth('access_token')
@UseGuards(AuthGuard('jwt'))
@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  @ApiOperation({ summary: 'List roles' })
  @ApiOkResponse({ description: 'List of roles' })
  findAll() {
    return this.roleService.findAll();
  }
}
