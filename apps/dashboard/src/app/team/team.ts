import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserManagementService } from '../services/user-management.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IUser } from '@turbovets/data/frontend';
import { RoleType } from '@turbovets/data/frontend';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'team-root',
  templateUrl: './team.html',
})
export class TeamComponent implements OnInit {
  loading: boolean = true;
  error: string | null = null;
  teamMembers: IUser[] = [];
  filteredMembers: IUser[] = [];
  showInviteModal: boolean = false;
  showDeleteModal: boolean = false;
  showEditModal: boolean = false;
  inviteEmail: string = '';
  inviteRole: string = 'member';
  memberToDelete: string | null = null;
  memberToEdit: IUser | null = null;
  userRole: RoleType | string = '';
  roles: any[] = [];

  editMemberData = {
    name: '',
    email: '',
    roleId: '',
    isActive: true,
  };

  activeMemberCount: number = 0;
  adminCount: number = 0;

  constructor(
    private authService: AuthService,
    private userManagementService: UserManagementService
  ) {}

  ngOnInit() {
    this.userRole = this.authService.getUserRoleName();
    this.loadTeamMembers();
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

  loadTeamMembers() {
    const organizationId = this.authService.getOrganizationId();
    if (!organizationId) {
      this.error = 'Organization ID not found.';
      this.loading = false;
      return;
    }

    this.loading = true;
    this.userManagementService
      .getUsersByOrganization(organizationId)
      .subscribe({
        next: (members) => {
          this.teamMembers = members;
          this.filteredMembers =
            this.userManagementService.filterActiveMembers(members);
          this.activeMemberCount =
            this.userManagementService.getActiveMembersCount(members);
          this.adminCount = this.userManagementService.getAdminCount(members);
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load team members.';
          this.loading = false;
        },
      });
  }

  getActiveMembersCount(): number {
    return this.activeMemberCount;
  }

  canCurerntUserManageUser(user: IUser): boolean {
    if (this.userRole === RoleType.ADMIN && user.role.name === RoleType.OWNER) {
      return false;
    }
    return true;
  }

  getAdminCount(): number {
    return this.adminCount;
  }

  closeInviteModal() {
    this.showInviteModal = false;
  }

  openDeleteModal(memberId: string) {
    this.memberToDelete = memberId;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.memberToDelete = null;
  }

  editMember(memberId: string) {
    const member = this.teamMembers.find((m) => m.id === memberId);
    if (!member) return;

    this.memberToEdit = member;
    this.editMemberData = {
      name: member.name,
      email: member.email,
      roleId: member.roleId,
      isActive: member.isActive,
    };
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.memberToEdit = null;
    this.editMemberData = {
      name: '',
      email: '',
      roleId: '',
      isActive: true,
    };
  }

  saveEditMember() {
    if (!this.memberToEdit) return;

    this.userManagementService
      .updateUser(this.memberToEdit.id, this.editMemberData)
      .subscribe({
        next: () => {
          this.closeEditModal();
          this.loadTeamMembers();
        },
        error: (err) => {
          this.error = 'Failed to update team member.';
          console.error('Error updating member:', err);
        },
      });
  }

  sendInvite() {}

  removeMember() {
    if (!this.memberToDelete) return;

    this.userManagementService.deleteUser(this.memberToDelete).subscribe({
      next: () => {
        this.closeDeleteModal();
        this.loadTeamMembers();
      },
      error: (err) => {
        this.error = 'Failed to remove team member.';
        this.closeDeleteModal();
      },
    });
  }
}
