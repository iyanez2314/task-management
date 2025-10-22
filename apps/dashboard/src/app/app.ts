import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxWelcome } from './nx-welcome';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from '../environments/environment';

@Component({
  imports: [RouterModule, CommonModule],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  protected title = 'dashboard';
  protected apiMessage = '';
  protected loading = false;
  protected error = '';

  ngOnInit() {
    this.fetchFromApi();
  }

  fetchFromApi() {
    this.loading = true;
    this.error = '';
    this.http.get<{ message: string }>(`${this.apiUrl}`).subscribe({
      next: (data) => {
        this.apiMessage = data.message;
        this.loading = false;
      },
      error: (err) => {
        this.error =
          'Failed to connect to API. Make sure the API is running on port 3000.';
        this.loading = false;
        console.error('API Error:', err);
      },
    });
  }
}
