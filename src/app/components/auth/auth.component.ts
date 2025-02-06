import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  email = '';
  password = '';
  isRegistering = false; 
  loginError: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  async submit() {
    this.loginError = null; 
    try {
      if (this.isRegistering) {
        await this.authService.register(this.email, this.password);
      } else {
        await this.authService.login(this.email, this.password);
      }
      this.router.navigate(['/home-auth']);
    } catch (error: any) {
      this.loginError = error?.message || 'An error occurred. Please try again.';
    }
  }

  toggleMode() {
    this.isRegistering = !this.isRegistering;
  }

  // Method to logout
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);  // Redirect to login page after logout
  }

  // Check if the user is logged in (optional)
  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}
