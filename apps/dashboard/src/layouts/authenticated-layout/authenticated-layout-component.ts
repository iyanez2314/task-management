import { Component, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../app/services/auth.service';

@Component({
  imports: [RouterModule, CommonModule],
  selector: 'authenticated-layout-root',
  templateUrl: './authenticated-layout.component.html',
})
export class AuthenticatedLayoutComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  sidebarOpen = false;

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
