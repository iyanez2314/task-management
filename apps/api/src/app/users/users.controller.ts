import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<User | null> {
    return this.usersService.findOne(id);
  }

  @Get('organization/:organizationId')
  findByOrganization(@Param('organizationId') organizationId: string): Promise<User[]> {
    return this.usersService.findByOrganization(organizationId);
  }

  @Post()
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
  remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id);
  }
}
