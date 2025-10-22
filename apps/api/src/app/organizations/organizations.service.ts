import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization, User } from '@turbovets/data';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization)
    private organizationsRepository: Repository<Organization>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll(): Promise<Organization[]> {
    return this.organizationsRepository.find({
      relations: ['users', 'tasks'],
    });
  }

  findOne(id: string): Promise<Organization | null> {
    return this.organizationsRepository.findOne({
      where: { id },
      relations: ['users', 'tasks'],
    });
  }

  async create(name: string, description?: string): Promise<Organization> {
    const organization = this.organizationsRepository.create({
      name,
      description,
    });
    return this.organizationsRepository.save(organization);
  }

  async update(id: string, name?: string, description?: string, isActive?: boolean): Promise<Organization> {
    await this.organizationsRepository.update(id, {
      ...(name && { name }),
      ...(description !== undefined && { description }),
      ...(isActive !== undefined && { isActive }),
    });
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.organizationsRepository.delete(id);
  }

  async findUsers(organizationId: string): Promise<User[]> {
    return this.usersRepository.find({
      where: { organizationId },
      relations: ['role'],
      select: ['id', 'name', 'email', 'roleId'],
    });
  }
}
