import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const userId = request.headers['x-user-id'];
    const organizationId = request.headers['x-organization-id'];
    const roleId = request.headers['x-role-id'];

    if (!userId) {
      throw new UnauthorizedException(
        'User not authenticated. Please provide x-user-id header.'
      );
    }

    request.user = {
      id: userId,
      organizationId: organizationId,
      roleId: roleId,
    };

    return true;
  }
}
