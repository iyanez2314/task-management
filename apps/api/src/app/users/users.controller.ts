import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { RolesGuard } from '../common/guards/roles.guard';
import { OrgOwnershipGuard } from '../common/guards/org-ownership.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleType } from '../roles/role.entity';

@Controller('users')
@UseGuards(OrgOwnershipGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(RoleType.ADMIN)
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Roles(RoleType.VIEWER)
  findOne(@Param('id') id: string): Promise<User | null> {
    return this.usersService.findOne(id);
  }

  @Get('organization/:organizationId')
  @Roles(RoleType.VIEWER)
  findByOrganization(@Param('organizationId') organizationId: string): Promise<User[]> {
    return this.usersService.findByOrganization(organizationId);
  }

  @Post()
  @Roles(RoleType.ADMIN)
  create(
    @Body() body: {
      email: string;
      name: string;
      organizationId: string;
      roleId: string;
    }
  ): Promise<User> {
    return this.usersService.create(
      body.email,
      body.name,
      body.organizationId,
      body.roleId
    );
  }

  @Put(':id')
  @Roles(RoleType.ADMIN)
  update(
    @Param('id') id: string,
    @Body() body: {
      name?: string;
      email?: string;
      roleId?: string;
      isActive?: boolean;
    }
  ): Promise<User> {
    return this.usersService.update(
      id,
      body.name,
      body.email,
      body.roleId,
      body.isActive
    );
  }

  @Delete(':id')
  @Roles(RoleType.OWNER)
  remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id);
  }
}
