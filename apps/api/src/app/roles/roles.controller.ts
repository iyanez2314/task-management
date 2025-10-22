import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { Role, RoleType, CreateRoleDto, UpdateRoleDto } from '@turbovets/data';
import { RolesGuard, Roles } from '@turbovets/auth';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @Roles(RoleType.VIEWER)
  findAll(): Promise<Role[]> {
    return this.rolesService.findAll();
  }

  @Get(':id')
  @Roles(RoleType.VIEWER)
  findOne(@Param('id') id: string): Promise<Role | null> {
    return this.rolesService.findOne(id);
  }

  @Post()
  @Roles(RoleType.OWNER)
  create(
    @Body() createRoleDto: CreateRoleDto
  ): Promise<Role> {
    return this.rolesService.create(
      createRoleDto.name,
      createRoleDto.description,
      createRoleDto.permissions
    );
  }

  @Post('/:id/permissions/:permissionId')
  @Roles(RoleType.OWNER)
  addPermission(
    @Param('id') id: string,
    @Param('permissionId') permissionId: string
  ): Promise<void> {
    return this.rolesService.addPermission(id, permissionId);
  }

  @Delete('/:id/permissions/:permissionId')
  @Roles(RoleType.OWNER)
  removePermission(
    @Param('id') id: string,
    @Param('permissionId') permissionId: string
  ): Promise<void> {
    return this.rolesService.removePermission(id, permissionId);
  }

  @Delete('/:id')
  @Roles(RoleType.OWNER)
  delete(@Param('id') id: string): Promise<void> {
    return this.rolesService.remove(id);
  }
}
