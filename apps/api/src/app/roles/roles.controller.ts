import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Delete,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { Role, RoleType } from './role.entity';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  findAll(): Promise<Role[]> {
    return this.rolesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Role | null> {
    return this.rolesService.findOne(id);
  }

  @Post()
  create(
    @Body()
    body: {
      name: RoleType;
      description?: string;
      permissions: string[];
    }
  ): Promise<Role> {
    return this.rolesService.create(
      body.name,
      body.description,
      body.permissions
    );
  }

  @Post('/:id/permissions/:permissionId')
  addPermission(
    @Param('id') id: string,
    @Param('permissionId') permissionId: string
  ): Promise<void> {
    return this.rolesService.addPermission(id, permissionId);
  }
  @Delete('/:id/permissions/:permissionId')
  removePermission(
    @Param('id') id: string,
    @Param('permissionId') permissionId: string
  ): Promise<void> {
    return this.rolesService.removePermission(id, permissionId);
  }

  @Delete('/:id')
  delete(@Param('id') id: string): Promise<void> {
    return this.rolesService.remove(id);
  }
}
