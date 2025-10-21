import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  imports: [RouterModule, CommonModule],
  selector: 'login-root',
  templateUrl: './login.html',
})
export class LoginComponent {
  private http = inject(HttpClient);
  protected title = 'turbovets-takehome';
}
