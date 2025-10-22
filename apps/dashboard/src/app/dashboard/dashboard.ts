import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import type { ITask, IUser } from '@turbovets/data/frontend';
import { RoleType } from '@turbovets/data/frontend';

@Component({
  imports: [RouterModule, CommonModule, FormsModule],
  selector: 'dashboard-root',
  templateUrl: './dashboard.html',
})
export class DashboardComponent implements OnInit {
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

  showAddUserModal: boolean = false;
  roles: any[] = [];
  newUser = {
    name: '',
    email: '',
    password: '',
    roleId: '',
  };

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loading = true;

    if (!this.authService.currentUser$) {
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
    this.http.get<ITask[]>('http://localhost:3000/api/tasks').subscribe({
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

  logout() {
    this.authService.logout();
  }

  openCreateTaskModal() {
    this.isEditMode = false;
    this.taskBeingEdited = null;
    this.showCreateModal = true;

    // Reset form
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

    this.http
      .get<IUser[]>(
        `http://localhost:3000/api/organizations/${organizationId}/users`
      )
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
        ? this.http.put<ITask>(
            `http://localhost:3000/api/tasks/${this.taskBeingEdited}`,
            taskData
          )
        : this.http.post<ITask>('http://localhost:3000/api/tasks', taskData);

    request.subscribe({
      next: (newTask) => {
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
          'Failed to create task: ' + (err.error?.message || 'Unknown error')
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
        this.http
          .get<IUser[]>(
            `http://localhost:3000/api/organizations/${organizationId}/users`
          )
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

    this.http
      .delete(`http://localhost:3000/api/tasks/${this.taskToDelete}`)
      .subscribe({
        next: () => {
          this.fetchTasks();

          this.closeDeleteModal();
        },
        error: (err) => {
          console.error('❌ Error deleting task:', err);
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

  canManageUsers(): boolean {
    const currentUser = this.authService.currentUserSubject.value;

    if (!currentUser || !currentUser.role) {
      return false;
    }

    return (
      currentUser.role.name === RoleType.OWNER ||
      currentUser.role.name === RoleType.ADMIN
    );
  }

  openAddUserModal() {
    this.showAddUserModal = true;

    // Reset form
    this.newUser = {
      name: '',
      email: '',
      password: '',
      roleId: '',
    };

    // Load available roles
    this.http.get<any[]>('http://localhost:3000/api/roles').subscribe({
      next: (roles) => {
        this.roles = roles;
      },
      error: (err) => {
        console.error('Error loading roles:', err);
      },
    });
  }

  closeAddUserModal() {
    this.showAddUserModal = false;
  }

  saveUser() {
    if (
      !this.newUser.name.trim() ||
      !this.newUser.email.trim() ||
      !this.newUser.password.trim() ||
      !this.newUser.roleId
    ) {
      alert('Please fill in all user details');
      return;
    }
    const organizationId = this.authService.getOrganizationId();
    if (!organizationId) {
      alert('Organization ID not found. Please log in again.');
      return;
    }

    const userData = {
      name: this.newUser.name,
      email: this.newUser.email,
      password: this.newUser.password,
      roleId: this.newUser.roleId,
      organizationId: organizationId,
    };

    this.http
      .post<IUser>('http://localhost:3000/api/users', userData)
      .subscribe({
        next: (newUser) => {
          alert('User created successfully');
          this.closeAddUserModal();
        },
        error: (err) => {
          alert(
            'Failed to create user: ' + (err.error?.message || 'Unknown error')
          );
        },
      });
  }
}
