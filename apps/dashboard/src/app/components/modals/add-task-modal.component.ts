import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { TaskManagementService } from '../../services/task-management.service';
import type { IUser } from '@turbovets/data/frontend';

@Component({
  selector: 'app-add-task-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div
      *ngIf="isOpen"
      class="fixed inset-0 bg-black/50 bg-opacity-90 flex items-center justify-center z-50"
      (click)="closeModal()"
    >
      <div
        class="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4"
        (click)="$event.stopPropagation()"
      >
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-800">Create New Task</h2>
          <button
            (click)="closeModal()"
            class="text-gray-400 hover:text-gray-600 transition"
          >
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form (ngSubmit)="saveTask()">
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2">Title *</label>
            <input
              [(ngModel)]="newTask.title"
              name="title"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter task title"
            />
          </div>

          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2">Description</label>
            <textarea
              [(ngModel)]="newTask.description"
              name="description"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter task description"
            ></textarea>
          </div>

          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2">Status</label>
            <select
              [(ngModel)]="newTask.status"
              name="status"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          <div class="mb-6">
            <label class="block text-gray-700 text-sm font-bold mb-2">Priority</label>
            <select
              [(ngModel)]="newTask.priority"
              name="priority"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div class="mb-6">
            <label class="block text-gray-700 text-sm font-bold mb-2">Assign To (Optional)</label>
            <select
              [(ngModel)]="newTask.assigneeId"
              name="assignee"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Unassigned</option>
              <option *ngFor="let user of users" [value]="user.id">
                {{ user.name }} ({{ user.email }})
              </option>
            </select>
          </div>

          <div class="flex gap-3">
            <button
              type="submit"
              class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-200"
            >
              Create Task
            </button>
            <button
              type="button"
              (click)="closeModal()"
              class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-md transition duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class AddTaskModalComponent implements OnInit {
  @Input() isOpen = false;
  @Output() isOpenChange = new EventEmitter<boolean>();
  @Output() taskAdded = new EventEmitter<void>();

  users: IUser[] = [];
  newTask = {
    title: '',
    description: '',
    status: 'todo',
    assigneeId: '',
    priority: 'medium',
  };

  constructor(
    private authService: AuthService,
    private taskManagementService: TaskManagementService
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    const organizationId = this.authService.getOrganizationId();
    if (!organizationId) {
      return;
    }

    this.taskManagementService.getUsersByOrganization(organizationId).subscribe({
      next: (users: IUser[]) => {
        this.users = users;
      },
      error: (err) => {
        console.error('Error loading users:', err);
      },
    });
  }

  closeModal() {
    this.isOpen = false;
    this.isOpenChange.emit(false);
    this.resetForm();
  }

  resetForm() {
    this.newTask = {
      title: '',
      description: '',
      status: 'todo',
      assigneeId: '',
      priority: 'medium',
    };
  }

  saveTask() {
    if (!this.newTask.title.trim()) {
      alert('Please enter a task title');
      return;
    }

    const organizationId = this.authService.getOrganizationId();
    if (!organizationId) {
      alert('Organization ID not found. Please log in again.');
      return;
    }

    const taskData = {
      title: this.newTask.title,
      description: this.newTask.description,
      status: this.newTask.status,
      priority: this.newTask.priority,
      assigneeId: this.newTask.assigneeId || null,
      organizationId: organizationId,
    };

    this.taskManagementService.createTask(taskData).subscribe({
      next: () => {
        alert('Task created successfully');
        this.closeModal();
        this.taskAdded.emit();
      },
      error: (err) => {
        alert(
          'Failed to create task: ' + (err.error?.message || 'Unknown error')
        );
      },
    });
  }
}
