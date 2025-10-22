import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '@turbovets/data';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(
    email: string,
    password: string,
    name: string,
    organizationId: string,
    roleId: string
  ): Promise<{ access_token: string; user: User }> {
    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.usersRepository.create({
      email,
      password: hashedPassword,
      name,
      organizationId,
      roleId,
    });

    const savedUser = await this.usersRepository.save(user);

    const userWithRole = await this.usersRepository.findOne({
      where: { id: savedUser.id },
      relations: ['role', 'organization'],
    });

    const payload = {
      sub: userWithRole.id,
      email: userWithRole.email,
      organizationId: userWithRole.organizationId,
      roleId: userWithRole.roleId,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: userWithRole,
    };
  }

  async login(email: string, password: string): Promise<{ access_token: string; user: User }> {
    const user = await this.usersRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'name', 'organizationId', 'roleId', 'isActive'],
      relations: ['role', 'organization'],
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('User account is disabled');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      organizationId: user.organizationId,
      roleId: user.roleId,
    };

    delete user.password;

    return {
      access_token: this.jwtService.sign(payload),
      user: user,
    };
  }

  async validateUser(userId: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id: userId, isActive: true },
      relations: ['role', 'organization'],
    });

    if (!user) {
      throw new UnauthorizedException('User not found or inactive');
    }

    return user;
  }
}
