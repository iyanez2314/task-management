import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import {
  Permission,
  RoleType,
  CreatePermissionDto,
  UpdatePermissionDto,
} from '@turbovets/data';
import { RolesGuard, Roles } from '@turbovets/auth';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  @Roles(RoleType.VIEWER)
  findAll(): Promise<Permission[]> {
    return this.permissionsService.findAll();
  }

  @Get(':id')
  @Roles(RoleType.VIEWER)
  findOne(@Param('id') id: string): Promise<Permission | null> {
    return this.permissionsService.findOne(id);
  }

  @Post()
  @Roles(RoleType.OWNER)
  create(
    @Body() createPermissionDto: CreatePermissionDto
  ): Promise<Permission> {
    return this.permissionsService.create(
      createPermissionDto.name,
      createPermissionDto.description
    );
  }

  @Put(':id')
  @Roles(RoleType.OWNER)
  update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto
  ): Promise<Permission | null> {
    return this.permissionsService.update(
      id,
      updatePermissionDto.name,
      updatePermissionDto.description
    );
  }

  @Delete(':id')
  @Roles(RoleType.OWNER)
  delete(@Param('id') id: string): Promise<void> {
    return this.permissionsService.remove(id);
  }
}
