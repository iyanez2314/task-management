import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { AuditLogsService } from './audit-logs.service';
import { RoleType, AuditLogResponseDto } from '@turbovets/data';
import { Roles, OrgOwnershipGuard } from '@turbovets/auth';

@Controller('audit-logs')
@UseGuards(OrgOwnershipGuard)
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  @Get('organization/:organizationId')
  @Roles(RoleType.ADMIN)
  findByOrganization(
    @Param('organizationId') organizationId: string
  ): Promise<AuditLogResponseDto[]> {
    return this.auditLogsService.findByOrganization(organizationId);
  }

  @Get('organization/:organizationId/recent')
  @Roles(RoleType.ADMIN)
  findRecentByOrganization(
    @Param('organizationId') organizationId: string
  ): Promise<AuditLogResponseDto[]> {
    return this.auditLogsService.findByOrganization(organizationId);
  }

  @Get('organization/:organizationId/user/:userId')
  @Roles(RoleType.ADMIN)
  findByUserInOrganization(
    @Param('organizationId') organizationId: string,
    @Param('userId') userId: string
  ): Promise<AuditLogResponseDto[]> {
    return this.auditLogsService.findByUser(userId);
  }
}
