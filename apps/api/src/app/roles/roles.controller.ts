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
import { RolesGuard } from '../common/guards/roles.guard';
import { UseGuards } from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';

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
