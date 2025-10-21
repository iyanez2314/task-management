import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleType } from '../../roles/role.entity';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UsersService } from '../../users/users.service';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly roleHierarchy = {
    [RoleType.OWNER]: 3,
    [RoleType.ADMIN]: 2,
    [RoleType.VIEWER]: 1,
  };

  constructor(
    private reflector: Reflector,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<RoleType[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.id) {
      throw new ForbiddenException('User not found in request');
    }

    const fullUser = await this.usersService.findOne(user.id);

    if (!fullUser || !fullUser.role) {
      throw new ForbiddenException('User role not found');
    }

    const userRoleLevel = this.roleHierarchy[fullUser.role.name];
    const hasPermission = requiredRoles.some(
      (role) => userRoleLevel >= this.roleHierarchy[role]
    );

    if (!hasPermission) {
      throw new ForbiddenException(
        `Insufficient permissions. Required: ${requiredRoles.join(' or ')}. User has: ${fullUser.role.name}`
      );
    }

    request.user = fullUser;
    return true;
  }
}
