import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { TaskManagementService } from '../services/task-management.service';
import type { ITask, IUser } from '@turbovets/data/frontend';
import { RoleType } from '@turbovets/data/frontend';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'tasks-root',
  templateUrl: './tasks.html',
})
export class TasksComponent implements OnInit {
  tasks: ITask[] = [];
  users: IUser[] = [];
  loading: boolean = true;
  error: string | null = null;

  showCreateModal: boolean = false;
  newTask = {
    title: '',
    description: '',
    status: 'todo',
    assigneeId: '',
    priority: 'medium',
  };

  showDeleteModal: boolean = false;
  taskToDelete: string | null = null;

  isEditMode: boolean = false;
  taskBeingEdited: string | null = null;

  constructor(
    private authService: AuthService,
    private taskManagementService: TaskManagementService
  ) {}

  ngOnInit() {
    this.loading = true;

    if (!this.authService.currentUserSubject.value) {
      this.authService.loadCurrentUser().subscribe({
        next: () => {
          this.fetchTasks();
        },
        error: (err) => {
          console.error('Error loading user:', err);
          this.error = 'Failed to load user data';
          this.loading = false;
        },
      });
    } else {
      this.fetchTasks();
    }
  }

  fetchTasks() {
    this.taskManagementService.getAllTasks().subscribe({
      next: (data: ITask[]) => {
        this.tasks = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching tasks:', err);
        this.error = 'Failed to load tasks. Please try again later.';
        this.loading = false;
      },
    });
  }

  openCreateTaskModal() {
    this.isEditMode = false;
    this.taskBeingEdited = null;
    this.showCreateModal = true;

    this.newTask = {
      title: '',
      description: '',
      status: 'todo',
      assigneeId: '',
      priority: 'medium',
    };

    const organizationId = this.authService.getOrganizationId();

    if (!organizationId) {
      alert('Organization ID not found. Please log in again.');
      this.showCreateModal = false;
      return;
    }

    this.taskManagementService
      .getUsersByOrganization(organizationId)
      .subscribe({
        next: (users: IUser[]) => {
          this.users = users;
        },
        error: (err) => {
          console.error('Error loading users:', err);
        },
      });
  }

  closeCreateModal() {
    this.showCreateModal = false;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.taskToDelete = null;
  }

  onOpenConfirmDeleteModal(taskId: string) {
    this.taskToDelete = taskId;
    this.showDeleteModal = true;
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
      organizationId: this.isEditMode ? undefined : organizationId,
    };

    const request =
      this.isEditMode && this.taskBeingEdited
        ? this.taskManagementService.updateTask(this.taskBeingEdited, taskData)
        : this.taskManagementService.createTask({
            ...taskData,
            organizationId: organizationId,
          });

    request.subscribe({
      next: () => {
        this.fetchTasks();
        this.closeCreateModal();
        this.newTask = {
          title: '',
          description: '',
          assigneeId: '',
          status: 'todo',
          priority: 'medium',
        };
      },
      error: (err) => {
        alert(
          'Failed to save task: ' + (err.error?.message || 'Unknown error')
        );
      },
    });
  }

  editTask(taskId: string) {
    const task = this.tasks.find((t) => t.id === taskId);

    if (task) {
      this.isEditMode = true;
      this.taskBeingEdited = taskId;
      this.showCreateModal = true;

      this.newTask = {
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        assigneeId: task.assignee?.id || '',
      };

      const organizationId = this.authService.getOrganizationId();
      if (organizationId) {
        this.taskManagementService
          .getUsersByOrganization(organizationId)
          .subscribe({
            next: (users: IUser[]) => {
              this.users = users;
            },
          });
      }
    }
  }

  deleteTask() {
    if (!this.taskToDelete) {
      return;
    }

    this.taskManagementService.deleteTask(this.taskToDelete).subscribe({
      next: () => {
        this.fetchTasks();
        this.closeDeleteModal();
      },
      error: (err) => {
        console.error('Error deleting task:', err);
        alert(
          'Failed to delete task: ' + (err.error?.message || 'Unknown error')
        );
      },
    });
  }

  canEditTask(task: ITask): boolean {
    const currentUser = this.authService.currentUserSubject.value;

    if (!currentUser || !currentUser.role) {
      return false;
    }

    if (
      currentUser.role.name === RoleType.OWNER ||
      currentUser.role.name === RoleType.ADMIN
    ) {
      return true;
    }

    return false;
  }

  canDeleteTask(task: ITask): boolean {
    const currentUser = this.authService.currentUserSubject.value;

    if (!currentUser || !currentUser.role) {
      return false;
    }

    if (currentUser.role.name === RoleType.OWNER) {
      return true;
    }

    return false;
  }

  canCreateTask(): boolean {
    const currentUser = this.authService.currentUserSubject.value;

    if (!currentUser || !currentUser.role) {
      return false;
    }

    return (
      currentUser.role.name === RoleType.OWNER ||
      currentUser.role.name === RoleType.ADMIN
    );
  }
}
