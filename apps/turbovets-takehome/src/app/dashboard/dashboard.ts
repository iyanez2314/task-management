import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  assignee?: {
    name: string;
    email: string;
  };
}

@Component({
  imports: [RouterModule, CommonModule, FormsModule],
  selector: 'dashboard-root',
  templateUrl: './dashboard.html',
})
export class DashboardComponent implements OnInit {
  tasks: Task[] = [];
  users: any[] = [];
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
    this.http.get<Task[]>('http://localhost:3000/api/tasks').subscribe({
      next: (data: any) => {
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
      .get<any[]>(
        `http://localhost:3000/api/organizations/${organizationId}/users`
      )
      .subscribe({
        next: (users) => {
          this.users = users;
          console.log('Users loaded:', users);
        },
        error: (err) => {
          console.error('Error loading users:', err);
        },
      });
  }

  closeCreateModal() {
    this.showCreateModal = false;
  }

  createTask() {
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

    this.http
      .post<Task>('http://localhost:3000/api/tasks', taskData)
      .subscribe({
        next: (newTask) => {
          console.log('✅ Task created:', newTask);

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
          console.error('❌ Error creating task:', err);
          alert(
            'Failed to create task: ' + (err.error?.message || 'Unknown error')
          );
        },
      });
  }
}
