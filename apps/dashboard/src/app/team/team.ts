import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IUser } from '@turbovets/data/frontend';
import { environment } from '../../environments/environment';

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'team-root',
  templateUrl: './team.html',
})
export class TeamComponent implements OnInit {
  private apiUrl = environment.apiUrl;
  loading: boolean = true;
  error: string | null = null;
  teamMembers: IUser[] = [];
  filteredMembers: IUser[] = [];
  showInviteModal: boolean = false;
  inviteEmail: string = '';
  inviteRole: string = 'member';

  constructor(private http: HttpClient, authService: AuthService) {}

  ngOnInit() {}

  getActiveMembersCount(): number {
    return 0;
  }

  closeInviteModal() {
    this.showInviteModal = false;
  }

  sendInvite() {}

  getAdminCount(): number {
    return 0;
  }

  editMember(memberId: string) {}

  removeMember(memberId: string) {}
}
