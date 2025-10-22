import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class OrgOwnershipGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    const organizationId =
      request.params?.organizationId || request.body?.organizationId;

    if (organizationId && user.organizationId !== organizationId) {
      throw new ForbiddenException(
        'Access denied. You can only access resources within your organization.'
      );
    }

    return true;
  }
}
