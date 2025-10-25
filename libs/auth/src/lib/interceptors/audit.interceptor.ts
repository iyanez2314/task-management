import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    @Inject('AUDIT_LOGS_SERVICE') private readonly auditLogsService: any
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, user, ip, headers } = request;
    const startTime = Date.now();

    const logData = {
      timestamp: new Date(),
      method,
      url,
      userId: user?.id || null,
      userEmail: user?.email || null,
      organizationId: user?.organizationId || null,
      role: user?.role?.name || null,
      requestBody: this.sanitizeBody(body),
      status: 'pending',
      ipAddress: ip || request.connection?.remoteAddress || null,
      userAgent: headers['user-agent'] || null,
    };

    console.log('🔍 AUDIT LOG:', JSON.stringify(logData, null, 2));

    return next.handle().pipe(
      tap({
        next: async (response) => {
          const responseTime = Date.now() - startTime;

          try {
            await this.auditLogsService.create({
              ...logData,
              status: 'success',
              statusCode: 200,
              responseTime,
            });
            console.log('✅ AUDIT LOG SAVED - SUCCESS');
          } catch (error) {
            console.error('❌ Failed to save audit log:', error);
          }
        },
        error: async (error) => {
          const responseTime = Date.now() - startTime;

          try {
            await this.auditLogsService.create({
              ...logData,
              status: 'error',
              statusCode: error.status || 500,
              errorMessage: error.message,
              responseTime,
            });
            console.log('✅ AUDIT LOG SAVED - ERROR');
          } catch (err) {
            console.error('❌ Failed to save audit log:', err);
          }
        },
      })
    );
  }

  private sanitizeBody(body: any): any {
    if (!body) return {};
    const sanitized = { ...body };
    if (sanitized.password) sanitized.password = '***REDACTED***';
    return sanitized;
  }
}
