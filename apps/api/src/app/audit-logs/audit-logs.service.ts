import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from '@turbovets/data';

@Injectable()
export class AuditLogsService {
  constructor(
    @InjectRepository(AuditLog)
    private auditLogsRepository: Repository<AuditLog>
  ) {}

  async create(auditLogData: {
    timestamp: Date;
    method: string;
    url: string;
    userId?: string;
    userEmail?: string;
    organizationId?: string;
    role?: string;
    requestBody?: any;
    status: string;
    statusCode?: number;
    errorMessage?: string;
    responseTime?: number;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<AuditLog> {
    const auditLog = this.auditLogsRepository.create(auditLogData);
    return this.auditLogsRepository.save(auditLog);
  }

  async findAll(): Promise<AuditLog[]> {
    return this.auditLogsRepository.find({
      order: { timestamp: 'DESC' },
      take: 100,
    });
  }

  async findByUser(userId: string): Promise<AuditLog[]> {
    return this.auditLogsRepository.find({
      where: { userId },
      order: { timestamp: 'DESC' },
      take: 50,
    });
  }

  async findByOrganization(organizationId: string): Promise<AuditLog[]> {
    return this.auditLogsRepository.find({
      where: { organizationId },
      order: { timestamp: 'DESC' },
      take: 100,
    });
  }

  async findRecent(limit: number = 20): Promise<AuditLog[]> {
    return this.auditLogsRepository.find({
      order: { timestamp: 'DESC' },
      take: limit,
    });
  }
}
