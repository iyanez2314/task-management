import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UserManagementService } from '../../services/user-management.service';

@Component({
  selector: 'app-add-user-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div
      *ngIf="isOpen"
      class="fixed inset-0 bg-black/50 bg-opacity-90 flex items-center justify-center z-50"
      (click)="closeModal()"
    >
      <div
        class="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4"
        (click)="$event.stopPropagation()"
      >
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-800">Add New User</h2>
          <button
            (click)="closeModal()"
            class="text-gray-400 hover:text-gray-600 transition"
          >
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form (ngSubmit)="saveUser()">
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2">Name *</label>
            <input
              [(ngModel)]="newUser.name"
              name="name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter user name"
            />
          </div>

          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2">Email *</label>
            <input
              [(ngModel)]="newUser.email"
              name="email"
              type="email"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter email address"
            />
          </div>

          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2">Password *</label>
            <input
              [(ngModel)]="newUser.password"
              name="password"
              type="password"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter password"
            />
          </div>

          <div class="mb-6">
            <label class="block text-gray-700 text-sm font-bold mb-2">Role *</label>
            <select
              [(ngModel)]="newUser.roleId"
              name="role"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select a role</option>
              <option *ngFor="let role of roles" [value]="role.id">
                {{ role.name }}
              </option>
            </select>
          </div>

          <div class="flex gap-3">
            <button
              type="submit"
              class="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition duration-200"
            >
              Add User
            </button>
            <button
              type="button"
              (click)="closeModal()"
              class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-md transition duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class AddUserModalComponent implements OnInit {
  @Input() isOpen = false;
  @Output() isOpenChange = new EventEmitter<boolean>();
  @Output() userAdded = new EventEmitter<void>();

  roles: any[] = [];
  newUser = {
    name: '',
    email: '',
    password: '',
    roleId: '',
  };

  constructor(
    private authService: AuthService,
    private userManagementService: UserManagementService
  ) {}

  ngOnInit() {
    this.loadRoles();
  }

  loadRoles() {
    this.userManagementService.getRoles().subscribe({
      next: (roles) => {
        this.roles = roles;
      },
      error: (err) => {
        console.error('Error loading roles:', err);
      },
    });
  }

  closeModal() {
    this.isOpen = false;
    this.isOpenChange.emit(false);
    this.resetForm();
  }

  resetForm() {
    this.newUser = {
      name: '',
      email: '',
      password: '',
      roleId: '',
    };
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

    this.userManagementService.createUser(userData).subscribe({
      next: () => {
        alert('User created successfully');
        this.closeModal();
        this.userAdded.emit();
      },
      error: (err) => {
        alert(
          'Failed to create user: ' + (err.error?.message || 'Unknown error')
        );
      },
    });
  }
}
