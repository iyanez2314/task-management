import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './permission.entity';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private permissionsRepository: Repository<Permission>
  ) {}

  findAll(): Promise<Permission[]> {
    return this.permissionsRepository.find();
  }

  findOne(id: string): Promise<Permission | null> {
    return this.permissionsRepository.findOne({ where: { id } });
  }

  async create(name: string, description: string): Promise<Permission> {
    const permission = this.permissionsRepository.create({
      name,
      description,
    });
    return this.permissionsRepository.save(permission);
  }

  async update(
    id: string,
    name?: string,
    description?: string
  ): Promise<Permission> {
    await this.permissionsRepository.update(id, {
      ...(name && { name }),
      ...(description && { description }),
    });
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.permissionsRepository.delete(id);
  }
}
