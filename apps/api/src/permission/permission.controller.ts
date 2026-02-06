import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { PermissionService } from './permission.service';

@ApiTags('permissions')
@ApiBearerAuth()
@ApiCookieAuth('access_token')
@UseGuards(AuthGuard('jwt'))
@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get()
  @ApiOperation({ summary: 'List permissions' })
  @ApiOkResponse({ description: 'List of permissions' })
  findAll() {
    return this.permissionService.findAll();
  }
}
