import { Component, inject, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, FormGroup } from '@angular/forms';

@Component({
  imports: [RouterModule, CommonModule, ReactiveFormsModule],
  selector: 'login-root',
  templateUrl: './login.html',
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: [''],
      password: [''],
    });
  }

  login() {
    const { email, password } = this.loginForm.value;

    this.http
      .post<{ access_token: string; user: any }>(
        'http://localhost:3000/api/auth/login',
        { email, password }
      )
      .subscribe({
        next: (response) => {
          console.log('✅ Login successful', response);

          // Store the token
          localStorage.setItem('access_token', response.access_token);

          // Redirect to dashboard
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('❌ Login failed', error);
          alert('Login failed: ' + (error.error?.message || 'Invalid credentials'));
        }
      });
  }
}
