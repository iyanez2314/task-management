export interface IAuditLog {
  id: string;
  timestamp: Date;
  method: string;
  url: string;
  userId: string | null;
  userEmail: string | null;
  organizationId: string | null;
  role: string | null;
  requestBody: any;
  status: string;
  statusCode: number | null;
  errorMessage: string | null;
  responseTime: number | null;
  ipAddress: string | null;
  userAgent: string | null;
}
