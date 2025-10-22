import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { Organization } from './organization.entity';
import { RolesGuard } from '../common/guards/roles.guard';
import { OrgOwnershipGuard } from '../common/guards/org-ownership.guard';
import { UseGuards } from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleType } from '../roles/role.entity';

@Controller('organizations')
@UseGuards(OrgOwnershipGuard)
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Get()
  @Roles(RoleType.VIEWER)
  findAll(): Promise<Organization[]> {
    return this.organizationsService.findAll();
  }

  @Get(':id')
  @Roles(RoleType.VIEWER)
  findOne(@Param('id') id: string): Promise<Organization | null> {
    return this.organizationsService.findOne(id);
  }

  @Get(':id/users')
  @Roles(RoleType.VIEWER)
  findUsers(@Param('id') id: string) {
    return this.organizationsService.findUsers(id);
  }

  @Post()
  @Roles(RoleType.OWNER)
  create(
    @Body() body: { name: string; description?: string }
  ): Promise<Organization> {
    return this.organizationsService.create(body.name, body.description);
  }

  @Put(':id')
  @Roles(RoleType.OWNER)
  update(
    @Param('id') id: string,
    @Body() body: { name?: string; description?: string; isActive?: boolean }
  ): Promise<Organization> {
    return this.organizationsService.update(
      id,
      body.name,
      body.description,
      body.isActive
    );
  }

  @Delete(':id')
  @Roles(RoleType.OWNER)
  remove(@Param('id') id: string): Promise<void> {
    return this.organizationsService.remove(id);
  }
}
