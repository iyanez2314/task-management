import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, TaskStatus, TaskPriority } from './task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>
  ) {}

  findAll(): Promise<Task[]> {
    return this.tasksRepository.find({
      relations: ['organization', 'assignee'],
    });
  }

  findOne(id: string): Promise<Task | null> {
    return this.tasksRepository.findOne({
      where: { id },
      relations: ['organization', 'assignee'],
    });
  }

  async create(
    title: string,
    description: string,
    organizationId: string,
    assigneeId?: string,
    status?: TaskStatus,
    priority?: TaskPriority,
    dueDate?: Date
  ): Promise<Task> {
    const task = this.tasksRepository.create({
      title,
      description,
      organizationId,
      ...(assigneeId && { assigneeId }),
      ...(status && { status }),
      ...(priority && { priority }),
      ...(dueDate && { dueDate }),
    });
    return this.tasksRepository.save(task);
  }

  findByOrganization(organizationId: string): Promise<Task[]> {
    return this.tasksRepository.find({
      where: { organizationId: organizationId },
      relations: ['organization', 'assignee'],
    });
  }

  findByAssignee(assigneeId: string): Promise<Task[]> {
    return this.tasksRepository.find({
      where: { assignee: { id: assigneeId } },
      relations: ['organization', 'assignee'],
    });
  }

  async update(
    id: string,
    title?: string,
    description?: string,
    status?: TaskStatus,
    priority?: TaskPriority,
    dueDate?: Date,
    assigneeId?: string
  ): Promise<Task> {
    await this.tasksRepository.update(id, {
      ...(title && { title }),
      ...(description !== undefined && { description }),
      ...(status && { status }),
      ...(priority && { priority }),
      ...(dueDate !== undefined && { dueDate }),
      ...(assigneeId !== undefined && { assigneeId }),
    });
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.tasksRepository.delete(id);
  }
}
