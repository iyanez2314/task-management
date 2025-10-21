import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, user } = request;
    const timestamp = new Date().toISOString();

    const logEntry = {
      timestamp,
      method,
      url,
      userId: user?.id || 'anonymous',
      userEmail: user?.email || 'N/A',
      organizationId: user?.organizationId || 'N/A',
      role: user?.role?.name || 'N/A',
      body: this.sanitizeBody(body),
    };

    console.log('🔍 AUDIT LOG:', JSON.stringify(logEntry, null, 2));

    return next.handle().pipe(
      tap({
        next: (response) => {
          console.log('✅ AUDIT LOG - SUCCESS:', {
            timestamp: new Date().toISOString(),
            method,
            url,
            userId: user?.id || 'anonymous',
            status: 'success',
          });
        },
        error: (error) => {
          console.log('❌ AUDIT LOG - ERROR:', {
            timestamp: new Date().toISOString(),
            method,
            url,
            userId: user?.id || 'anonymous',
            status: 'error',
            error: error.message,
          });
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
