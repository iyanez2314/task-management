import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { IUser } from '@turbovets/data/frontend';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserManagementService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  getUsersByOrganization(organizationId: string): Observable<IUser[]> {
    return this.http.get<IUser[]>(
      `${this.apiUrl}/users/organization/${organizationId}`
    );
  }

  getUserById(userId: string): Observable<IUser> {
    return this.http.get<IUser>(`${this.apiUrl}/users/${userId}`);
  }

  createUser(userData: {
    email: string;
    name: string;
    organizationId: string;
    roleId: string;
    password?: string;
  }): Observable<IUser> {
    return this.http.post<IUser>(`${this.apiUrl}/users`, userData);
  }

  updateUser(
    userId: string,
    userData: {
      name?: string;
      email?: string;
      roleId?: string;
      isActive?: boolean;
    }
  ): Observable<IUser> {
    return this.http.put<IUser>(`${this.apiUrl}/users/${userId}`, userData);
  }

  deleteUser(userId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${userId}`);
  }

  getRoles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/roles`);
  }

  getActiveMembersCount(users: IUser[]): number {
    return users.filter((user) => user.isActive).length;
  }

  getAdminCount(users: IUser[]): number {
    return users.filter((user) => user.role?.name === 'admin').length;
  }

  filterActiveMembers(users: IUser[]): IUser[] {
    const filteredUsers = users.filter(
      (user) =>
        user.id !== this.authService.currentUserSubject.value?.id &&
        user.isActive
    );
    return filteredUsers;
  }
}
