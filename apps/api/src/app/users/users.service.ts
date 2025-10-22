import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@turbovets/data';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
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
    roleId: string,
    password?: string
  ): Promise<User> {
    const userData: any = {
      email,
      name,
      organizationId,
      roleId,
    };

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      userData.password = hashedPassword;
    }

    const user = this.usersRepository.create(userData);
    const savedUser = await this.usersRepository.save(user);

    const userId = Array.isArray(savedUser)
      ? savedUser[0].id
      : (savedUser as User).id;
    return this.findOne(userId);
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
