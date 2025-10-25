import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import type { IAuditLog } from '@turbovets/data/frontend';

@Component({
  selector: 'app-recent-logs',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold text-gray-800">Recent Activity</h2>
        <a
          routerLink="/organization-logs"
          class="text-sm text-blue-600 hover:text-blue-700 font-medium transition"
        >
          View All →
        </a>
      </div>

      <div class="space-y-3">
        <div
          *ngFor="let log of logs"
          class="flex items-center justify-between p-4 border-l-4 rounded-r-lg transition hover:bg-gray-50"
          [ngClass]="{
            'border-green-500 bg-green-50/50': log.status === 'success',
            'border-red-500 bg-red-50/50': log.status === 'error'
          }"
        >
          <div class="flex items-center gap-3 flex-1">
            <!-- User Avatar -->
            <div
              class="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-sm flex-shrink-0"
            >
              {{ log.userEmail ? log.userEmail.charAt(0).toUpperCase() : '?' }}
            </div>

            <!-- Log Details -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <span
                  class="px-2 py-0.5 rounded text-xs font-semibold"
                  [ngClass]="{
                    'bg-blue-100 text-blue-700': log.method === 'GET',
                    'bg-green-100 text-green-700': log.method === 'POST',
                    'bg-yellow-100 text-yellow-700': log.method === 'PUT' || log.method === 'PATCH',
                    'bg-red-100 text-red-700': log.method === 'DELETE'
                  }"
                >
                  {{ log.method }}
                </span>
                <span class="text-sm text-gray-700 font-mono truncate">
                  {{ log.url }}
                </span>
              </div>
              <div class="flex items-center gap-2 text-xs text-gray-500">
                <span>{{ log.userEmail || 'Unknown' }}</span>
                <span>•</span>
                <span>{{ log.timestamp | date: 'short' }}</span>
              </div>
            </div>

            <!-- Status Badge -->
            <span
              class="px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 flex-shrink-0"
              [ngClass]="{
                'bg-green-100 text-green-700': log.status === 'success',
                'bg-red-100 text-red-700': log.status === 'error'
              }"
            >
              <svg
                *ngIf="log.status === 'success'"
                class="w-3 h-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                />
              </svg>
              <svg
                *ngIf="log.status === 'error'"
                class="w-3 h-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd"
                />
              </svg>
              {{ log.statusCode }}
            </span>
          </div>
        </div>

        <div *ngIf="logs.length === 0" class="text-center py-8 text-gray-500">
          No recent activity
        </div>
      </div>
    </div>
  `,
})
export class RecentLogsComponent {
  @Input() logs: IAuditLog[] = [];
}
