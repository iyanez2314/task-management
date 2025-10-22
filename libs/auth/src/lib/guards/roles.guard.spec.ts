import { RolesGuard } from './roles.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { RoleType } from '@turbovets/data';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;
  let mockUsersService: any;

  beforeEach(() => {
    reflector = new Reflector();
    mockUsersService = {
      findOne: jest.fn(),
    };
    guard = new RolesGuard(reflector, mockUsersService);
  });

  const createMockContext = (user: any, requiredRoles: RoleType[] = []): ExecutionContext => {
    const mockRequest = { user };

    return {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as any;
  };

  describe('role hierarchy', () => {
    it('should allow OWNER to access ADMIN endpoint', async () => {
      const context = createMockContext({ id: '123' });
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([RoleType.ADMIN]);

      mockUsersService.findOne.mockResolvedValue({
        id: '123',
        role: { name: RoleType.OWNER },
      });

      const result = await guard.canActivate(context);
      expect(result).toBe(true);
    });

    it('should allow ADMIN to access VIEWER endpoint', async () => {
      const context = createMockContext({ id: '123' });
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([RoleType.VIEWER]);

      mockUsersService.findOne.mockResolvedValue({
        id: '123',
        role: { name: RoleType.ADMIN },
      });

      const result = await guard.canActivate(context);
      expect(result).toBe(true);
    });

    it('should block VIEWER from ADMIN endpoint', async () => {
      const context = createMockContext({ id: '123' });
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([RoleType.ADMIN]);

      mockUsersService.findOne.mockResolvedValue({
        id: '123',
        role: { name: RoleType.VIEWER },
      });

      await expect(guard.canActivate(context)).rejects.toThrow(ForbiddenException);
    });

    it('should block ADMIN from OWNER endpoint', async () => {
      const context = createMockContext({ id: '123' });
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([RoleType.OWNER]);

      mockUsersService.findOne.mockResolvedValue({
        id: '123',
        role: { name: RoleType.ADMIN },
      });

      await expect(guard.canActivate(context)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('edge cases', () => {
    it('should allow access when no roles required', async () => {
      const context = createMockContext({ id: '123' });
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(null);

      const result = await guard.canActivate(context);
      expect(result).toBe(true);
    });

    it('should throw when user not in request', async () => {
      const context = createMockContext(null);
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([RoleType.VIEWER]);

      await expect(guard.canActivate(context)).rejects.toThrow(ForbiddenException);
    });

    it('should throw when user has no role', async () => {
      const context = createMockContext({ id: '123' });
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([RoleType.VIEWER]);

      mockUsersService.findOne.mockResolvedValue({
        id: '123',
        role: null,
      });

      await expect(guard.canActivate(context)).rejects.toThrow(ForbiddenException);
    });
  });
});
