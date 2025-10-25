import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import type { ITask } from '@turbovets/data/frontend';

@Component({
  selector: 'app-recent-tasks',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold text-gray-800">Recent Tasks</h2>
        <a
          routerLink="/tasks"
          class="text-sm text-blue-600 hover:text-blue-700 font-medium transition"
        >
          View All →
        </a>
      </div>

      <div class="space-y-3">
        <div
          *ngFor="let task of tasks"
          class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer"
          [routerLink]="['/tasks']"
        >
          <div class="flex-1">
            <h3 class="font-semibold text-gray-800 mb-1">{{ task.title }}</h3>
            <p class="text-sm text-gray-600 line-clamp-1">
              {{ task.description }}
            </p>
          </div>
          <div class="flex items-center gap-3 ml-4">
            <span
              class="px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
              [ngClass]="{
                'bg-red-100 text-red-700': task.priority === 'high',
                'bg-yellow-100 text-yellow-700': task.priority === 'medium',
                'bg-green-100 text-green-700': task.priority === 'low'
              }"
            >
              {{ task.priority | uppercase }}
            </span>
            <span
              class="px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
              [ngClass]="{
                'bg-blue-100 text-blue-700': task.status === 'in-progress' || task.status === 'in progress',
                'bg-emerald-100 text-emerald-700': task.status === 'completed' || task.status === 'done',
                'bg-gray-100 text-gray-700': task.status === 'pending' || task.status === 'todo'
              }"
            >
              {{ task.status }}
            </span>
          </div>
        </div>

        <div *ngIf="tasks.length === 0" class="text-center py-8 text-gray-500">
          No recent tasks
        </div>
      </div>
    </div>
  `,
})
export class RecentTasksComponent {
  @Input() tasks: ITask[] = [];
}
