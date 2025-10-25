import { Component, inject, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../app/services/auth.service';
import { AddUserModalComponent } from '../../app/components/modals/add-user-modal.component';
import { AddTaskModalComponent } from '../../app/components/modals/add-task-modal.component';

@Component({
  standalone: true,
  imports: [RouterModule, CommonModule, AddUserModalComponent, AddTaskModalComponent],
  selector: 'authenticated-layout-root',
  templateUrl: './authenticated-layout.component.html',
})
export class AuthenticatedLayoutComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  userName: string | null = null;
  userEmail: string | null = null;

  sidebarOpen = false;
  showFabActions = false;
  showAddUserModal = false;
  showAddTaskModal = false;

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

  toggleFabActions() {
    this.showFabActions = !this.showFabActions;
  }

  openAddTask() {
    this.showAddTaskModal = true;
    this.showFabActions = false;
  }

  openAddUser() {
    this.showAddUserModal = true;
    this.showFabActions = false;
  }

  onTaskAdded() {
    window.location.reload();
  }

  onUserAdded() {
    window.location.reload();
  }
}
