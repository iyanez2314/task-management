import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  imports: [RouterModule, CommonModule, ReactiveFormsModule],
  selector: 'login-root',
  templateUrl: './login.html',
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: [''],
      password: [''],
    });
  }

  login() {
    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (response) => {
        console.log('✅ Login successful', response);
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
