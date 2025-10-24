import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import type { IUser } from '@turbovets/data/frontend';
import { RoleType } from '@turbovets/data/frontend';
import { environment } from '../../environments/environment';

export type User = IUser;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  public currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  login(
    email: string,
    password: string
  ): Observable<{ access_token: string; user: User }> {
    return this.http
      .post<{ access_token: string; user: User }>(`${this.apiUrl}/auth/login`, {
        email,
        password,
      })
      .pipe(
        tap((response) => {
          localStorage.setItem('access_token', response.access_token);
          this.currentUserSubject.next(response.user);
        })
      );
  }

  logout() {
    localStorage.removeItem('access_token');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  loadCurrentUser(): Observable<User> {
    return this.http
      .get<User>(`${this.apiUrl}/auth/me`)
      .pipe(tap((user) => this.currentUserSubject.next(user)));
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }

  getOrganizationId(): string | null {
    const user = this.currentUserSubject.value;
    return user ? user.organizationId : null;
  }

  getUserRoleName(): RoleType | string {
    const user = this.currentUserSubject.value;
    return user ? user.role.name : '';
  }

  currentUserId(): string | null {
    const user = this.currentUserSubject.value;
    return user ? user.id : null;
  }
}
