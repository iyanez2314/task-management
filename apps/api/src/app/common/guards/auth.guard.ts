import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    // MOCK: For now, we'll simulate a logged-in user
    // In production, you'd verify JWT token here
    const userId = request.headers['x-user-id'];
    const organizationId = request.headers['x-organization-id'];
    const roleId = request.headers['x-role-id'];

    if (!userId) {
      throw new UnauthorizedException('User not authenticated. Please provide x-user-id header.');
    }

    // Attach mock user to request
    request.user = {
      id: userId,
      organizationId: organizationId,
      roleId: roleId,
    };

    return true;
  }
}
