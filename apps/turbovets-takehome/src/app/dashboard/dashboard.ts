import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  loading: boolean = true;
  error: string | null = null;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.loading = true;
    this.http.get<Task[]>('http://localhost:3000/api/tasks').subscribe({
      next: (data: any) => {
        this.tasks = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching user data:', err);
        this.error = 'Failed to load tasks. Please try again later.';
      },
    });
  }

  logout() {
    localStorage.removeItem('access_token');
    this.router.navigate(['/login']);
  }
}
