import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ITask, IUser } from '@turbovets/data/frontend';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TaskManagementService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAllTasks(): Observable<ITask[]> {
    return this.http.get<ITask[]>(`${this.apiUrl}/tasks`);
  }

  getTaskById(taskId: string): Observable<ITask> {
    return this.http.get<ITask>(`${this.apiUrl}/tasks/${taskId}`);
  }

  createTask(taskData: {
    title: string;
    description: string;
    status: string;
    priority: string;
    assigneeId?: string | null;
    organizationId: string;
  }): Observable<ITask> {
    return this.http.post<ITask>(`${this.apiUrl}/tasks`, taskData);
  }

  updateTask(
    taskId: string,
    taskData: {
      title?: string;
      description?: string;
      status?: string;
      priority?: string;
      assigneeId?: string | null;
    }
  ): Observable<ITask> {
    return this.http.put<ITask>(`${this.apiUrl}/tasks/${taskId}`, taskData);
  }

  deleteTask(taskId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/tasks/${taskId}`);
  }

  getUsersByOrganization(organizationId: string): Observable<IUser[]> {
    return this.http.get<IUser[]>(
      `${this.apiUrl}/organizations/${organizationId}/users`
    );
  }
}
