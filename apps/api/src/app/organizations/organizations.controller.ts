import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { Organization } from './organization.entity';

@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Get()
  findAll(): Promise<Organization[]> {
    return this.organizationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Organization | null> {
    return this.organizationsService.findOne(id);
  }

  @Post()
  create(
    @Body() body: { name: string; description?: string }
  ): Promise<Organization> {
    return this.organizationsService.create(body.name, body.description);
  }

  @Put(':id')
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
  remove(@Param('id') id: string): Promise<void> {
    return this.organizationsService.remove(id);
  }
}
