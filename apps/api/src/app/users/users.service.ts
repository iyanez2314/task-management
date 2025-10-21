import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find({
      relations: ['organization', 'role', 'assignedTasks'],
    });
  }

  findOne(id: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { id },
      relations: ['organization', 'role', 'assignedTasks'],
    });
  }

  findByOrganization(organizationId: string): Promise<User[]> {
    return this.usersRepository.find({
      where: { organizationId },
      relations: ['role', 'assignedTasks'],
    });
  }

  async create(
    email: string,
    name: string,
    organizationId: string,
    roleId: string
  ): Promise<User> {
    const user = this.usersRepository.create({
      email,
      name,
      organizationId,
      roleId,
    });
    return this.usersRepository.save(user);
  }

  async update(
    id: string,
    name?: string,
    email?: string,
    roleId?: string,
    isActive?: boolean
  ): Promise<User> {
    await this.usersRepository.update(id, {
      ...(name && { name }),
      ...(email && { email }),
      ...(roleId && { roleId }),
      ...(isActive !== undefined && { isActive }),
    });
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
