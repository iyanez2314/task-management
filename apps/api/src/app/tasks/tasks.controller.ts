import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task, TaskStatus, TaskPriority } from './task.entity';
import { AuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { OrgOwnershipGuard } from '../common/guards/org-ownership.guard';
import { AuditInterceptor } from '../common/interceptors/audit.interceptor';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RoleType } from '../roles/role.entity';
import { User } from '../users/user.entity';

@Controller('tasks')
@UseGuards(OrgOwnershipGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @Roles(RoleType.VIEWER)
  findAll(@CurrentUser() user: User): Promise<Task[]> {
    return this.tasksService.findAll();
  }

  @Get(':id')
  @Roles(RoleType.VIEWER)
  findOne(@Param('id') id: string): Promise<Task | null> {
    return this.tasksService.findOne(id);
  }

  @Get('organization/:organizationId')
  @Roles(RoleType.VIEWER)
  findByOrganization(
    @Param('organizationId') organizationId: string
  ): Promise<Task[]> {
    return this.tasksService.findByOrganization(organizationId);
  }

  @Get('assignee/:assigneeId')
  @Roles(RoleType.VIEWER)
  findByAssignee(@Param('assigneeId') assigneeId: string): Promise<Task[]> {
    return this.tasksService.findByAssignee(assigneeId);
  }

  @Post()
  @Roles(RoleType.ADMIN)
  create(
    @Body()
    body: {
      title: string;
      description?: string;
      organizationId: string;
      assigneeId?: string;
      status?: TaskStatus;
      priority?: TaskPriority;
      dueDate?: Date;
    }
  ): Promise<Task> {
    return this.tasksService.create(
      body.title,
      body.description,
      body.organizationId,
      body.assigneeId,
      body.status,
      body.priority,
      body.dueDate
    );
  }

  @Put(':id')
  @Roles(RoleType.ADMIN)
  update(
    @Param('id') id: string,
    @Body()
    body: {
      title?: string;
      description?: string;
      status?: TaskStatus;
      priority?: TaskPriority;
      dueDate?: Date;
      assigneeId?: string;
    }
  ): Promise<Task> {
    return this.tasksService.update(
      id,
      body.title,
      body.description,
      body.status,
      body.priority,
      body.dueDate,
      body.assigneeId
    );
  }

  @Delete(':id')
  @Roles(RoleType.OWNER)
  remove(@Param('id') id: string): Promise<void> {
    return this.tasksService.remove(id);
  }
}
