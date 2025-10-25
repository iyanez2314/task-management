import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { IAuditLog } from '@turbovets/data/frontend';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class OrgLogsService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  getLogsByOrganization(organizationId: string): Observable<IAuditLog[]> {
    return this.http.get<IAuditLog[]>(
      `${this.apiUrl}/audit-logs/organization/${organizationId}`
    );
  }

  getRecentLogsByOrganization(organizationId: string): Observable<IAuditLog[]> {
    return this.http.get<IAuditLog[]>(
      `${this.apiUrl}/audit-logs/organization/${organizationId}/recent`
    );
  }

  getLogsByUserInOrganization(
    organizationId: string,
    userId: string
  ): Observable<IAuditLog[]> {
    return this.http.get<IAuditLog[]>(
      `${this.apiUrl}/audit-logs/organization/${organizationId}/user/${userId}`
    );
  }
}
