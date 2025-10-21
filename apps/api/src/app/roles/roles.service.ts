import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role, RoleType } from './role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>
  ) {}

  findAll(): Promise<Role[]> {
    return this.rolesRepository.find({
      relations: ['permissions'],
    });
  }

  findOne(id: string): Promise<Role | null> {
    return this.rolesRepository.findOne({
      where: { id },
      relations: ['permissions'],
    });
  }

  async create(
    name: RoleType,
    description: string,
    permissionIds: string[]
  ): Promise<Role> {
    const role = this.rolesRepository.create({
      name,
      description,
      permissions: permissionIds.map((id) => ({ id })),
    });
    return this.rolesRepository.save(role);
  }

  findByName(name: RoleType): Promise<Role | null> {
    return this.rolesRepository.findOne({
      where: { name },
      relations: ['permissions'],
    });
  }

  addPermission(roleId: string, permissionId: string): Promise<void> {
    return this.rolesRepository
      .createQueryBuilder()
      .relation(Role, 'permissions')
      .of(roleId)
      .add(permissionId);
  }

  removePermission(roleId: string, permissionId: string): Promise<void> {
    return this.rolesRepository
      .createQueryBuilder()
      .relation(Role, 'permissions')
      .of(roleId)
      .remove(permissionId);
  }

  async remove(id: string): Promise<void> {
    await this.rolesRepository.delete(id);
  }
}
