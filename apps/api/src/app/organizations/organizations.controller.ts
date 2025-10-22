import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import {
  Organization,
  RoleType,
  CreateOrganizationDto,
  UpdateOrganizationDto,
} from '@turbovets/data';
import { OrgOwnershipGuard, Roles } from '@turbovets/auth';

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
    @Body() createOrganizationDto: CreateOrganizationDto
  ): Promise<Organization> {
    return this.organizationsService.create(
      createOrganizationDto.name,
      createOrganizationDto.description
    );
  }

  @Put(':id')
  @Roles(RoleType.OWNER)
  update(
    @Param('id') id: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto
  ): Promise<Organization> {
    return this.organizationsService.update(
      id,
      updateOrganizationDto.name,
      updateOrganizationDto.description,
      updateOrganizationDto.isActive
    );
  }

  @Delete(':id')
  @Roles(RoleType.OWNER)
  remove(@Param('id') id: string): Promise<void> {
    return this.organizationsService.remove(id);
  }
}
