import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RoleService } from './role.service';
import { UpdateRolePermissionsDto } from './dto/update_role_permissions.dto';

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

  @Put(':id/permissions')
  @ApiOperation({ summary: 'Update role permissions' })
  @ApiOkResponse({ description: 'Role permissions updated' })
  updatePermissions(
    @Param('id') id: string,
    @Body() body: UpdateRolePermissionsDto,
  ) {
    return this.roleService.assignPermissions(Number(id), body.permissionIds);
  }
}
