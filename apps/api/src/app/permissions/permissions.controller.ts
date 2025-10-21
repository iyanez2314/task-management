import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { Permission } from './permission.entity';
import { RolesGuard } from '../common/guards/roles.guard';
import { UseGuards } from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleType } from '../roles/role.entity';

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
    @Body()
    body: {
      name: string;
      description?: string;
    }
  ): Promise<Permission> {
    return this.permissionsService.create(body.name, body.description);
  }

  @Put(':id')
  @Roles(RoleType.OWNER)
  update(
    @Param('id') id: string,
    @Body()
    body: {
      name?: string;
      description?: string;
    }
  ): Promise<Permission | null> {
    return this.permissionsService.update(id, body.name, body.description);
  }

  @Delete(':id')
  @Roles(RoleType.OWNER)
  delete(@Param('id') id: string): Promise<void> {
    return this.permissionsService.remove(id);
  }
}
