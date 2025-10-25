import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtAuthGuard, RolesGuard, AuditInterceptor } from '@turbovets/auth';
import { UsersModule } from '../users/users.module';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { AuditLog } from '@turbovets/data';

@Module({
  imports: [UsersModule, AuditLogsModule, TypeOrmModule.forFeature([AuditLog])],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: 'AUDIT_LOGS_SERVICE',
      useClass: AuditLogsService,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    },
  ],
})
export class CommonModule {}
