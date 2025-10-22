import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User, RoleType, CreateUserDto, UpdateUserDto } from '@turbovets/data';
import { OrgOwnershipGuard, Roles } from '@turbovets/auth';

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
  findByOrganization(
    @Param('organizationId') organizationId: string
  ): Promise<User[]> {
    return this.usersService.findByOrganization(organizationId);
  }

  @Post()
  @Roles(RoleType.ADMIN)
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(
      createUserDto.email,
      createUserDto.name,
      createUserDto.organizationId,
      createUserDto.roleId
    );
  }

  @Put(':id')
  @Roles(RoleType.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<User> {
    return this.usersService.update(
      id,
      updateUserDto.name,
      updateUserDto.email,
      updateUserDto.roleId,
      updateUserDto.isActive
    );
  }

  @Delete(':id')
  @Roles(RoleType.OWNER)
  remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id);
  }
}
