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

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  findAll(): Promise<Permission[]> {
    return this.permissionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Permission | null> {
    return this.permissionsService.findOne(id);
  }

  @Post()
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
  delete(@Param('id') id: string): Promise<void> {
    return this.permissionsService.remove(id);
  }
}
