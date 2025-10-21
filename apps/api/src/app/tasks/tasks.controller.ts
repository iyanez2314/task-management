import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task, TaskStatus, TaskPriority } from './task.entity';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll(): Promise<Task[]> {
    return this.tasksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Task | null> {
    return this.tasksService.findOne(id);
  }

  @Get('organization/:organizationId')
  findByOrganization(
    @Param('organizationId') organizationId: string
  ): Promise<Task[]> {
    return this.tasksService.findByOrganization(organizationId);
  }

  @Get('assignee/:assigneeId')
  findByAssignee(@Param('assigneeId') assigneeId: string): Promise<Task[]> {
    return this.tasksService.findByAssignee(assigneeId);
  }

  @Post()
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
  remove(@Param('id') id: string): Promise<void> {
    return this.tasksService.remove(id);
  }
}
