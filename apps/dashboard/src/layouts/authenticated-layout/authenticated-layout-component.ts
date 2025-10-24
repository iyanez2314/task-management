import { Component, inject, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../app/services/auth.service';

@Component({
  imports: [RouterModule, CommonModule],
  selector: 'authenticated-layout-root',
  templateUrl: './authenticated-layout.component.html',
})
export class AuthenticatedLayoutComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  userName: string | null = null;
  userEmail: string | null = null;

  sidebarOpen = false;

  ngOnInit() {
    this.authService.currentUser$.subscribe((user) => {
      this.userName = user?.name || 'Name Not Found';
      this.userEmail = user?.email || 'Email Not Found';
    });

    if (!this.authService.currentUserSubject.value) {
      this.authService.loadCurrentUser().subscribe();
    }
  }

  getUserName(): string | null {
    return this.userName;
  }

  getUserEmail(): string | null {
    return this.userEmail;
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
