import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { IAuditLog, IUser } from '@turbovets/data/frontend';
import { OrgLogsService } from '../services/org-logs.service';
import { UserManagementService } from '../services/user-management.service';

@Component({
  standalone: true,
  imports: [FormsModule, CommonModule],
  selector: 'org-logs',
  templateUrl: './org-logs.html',
})
export class OrgLogsComponent implements OnInit {
  logs: IAuditLog[] = [];
  organizationUsers: IUser[] = [];
  loading: boolean = true;
  error: string | null = null;
  showDetailsModal: boolean = false;
  selectedLog: IAuditLog | null = null;

  constructor(
    private authService: AuthService,
    private orgLogService: OrgLogsService,
    private userService: UserManagementService
  ) {}

  ngOnInit(): void {
    this.loadOnitData();
  }

  loadOnitData(): void {
    const userOrganizationId = this.authService.getOrganizationId() || '';
    this.orgLogService.getLogsByOrganization(userOrganizationId).subscribe({
      next: (logs) => {
        this.logs = logs;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load logs.';
        this.loading = false;
      },
    });

    this.userService.getUsersByOrganization(userOrganizationId).subscribe({
      next: (users) => {
        this.organizationUsers = users;
      },
      error: (err) => {
        this.error = 'Failed to load organization users.';
      },
    });
  }

  refreshLogs(): void {
    this.loading = true;
    this.error = null;
    this.loadOnitData();
  }

  showUserSpecificLogs(userId: string): void {
    this.loading = true;
    this.error = null;

    // If empty string, show all logs
    if (!userId || userId === '') {
      this.loadOnitData();
      return;
    }

    const userOrganizationId = this.authService.getOrganizationId() || '';

    if (!userOrganizationId) {
      this.error = 'User is not associated with any organization.';
      this.loading = false;
      return;
    }

    this.orgLogService
      .getLogsByUserInOrganization(userOrganizationId, userId)
      .subscribe({
        next: (logs) => {
          this.logs = logs;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load user-specific logs.';
          this.loading = false;
        },
      });
  }

  openDetailsModal(log: IAuditLog): void {
    this.selectedLog = log;
    this.showDetailsModal = true;
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedLog = null;
  }

  formatJSON(obj: any): string {
    if (!obj) return 'No data';
    return JSON.stringify(obj, null, 2);
  }
}
