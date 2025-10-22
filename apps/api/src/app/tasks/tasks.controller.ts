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
import { TasksService } from './tasks.service';
import {
  Task,
  User,
  RoleType,
  CreateTaskDto,
  UpdateTaskDto,
} from '@turbovets/data';
import { OrgOwnershipGuard, Roles, CurrentUser } from '@turbovets/auth';

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
  create(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksService.create(
      createTaskDto.title,
      createTaskDto.description,
      createTaskDto.organizationId,
      createTaskDto.assigneeId,
      createTaskDto.status,
      createTaskDto.priority,
      createTaskDto.dueDate
    );
  }

  @Put(':id')
  @Roles(RoleType.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto
  ): Promise<Task> {
    return this.tasksService.update(
      id,
      updateTaskDto.title,
      updateTaskDto.description,
      updateTaskDto.status,
      updateTaskDto.priority,
      updateTaskDto.dueDate,
      updateTaskDto.assigneeId
    );
  }

  @Delete(':id')
  @Roles(RoleType.OWNER)
  remove(@Param('id') id: string): Promise<void> {
    return this.tasksService.remove(id);
  }
}
