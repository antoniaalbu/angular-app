import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { getAuth, onAuthStateChanged, sendEmailVerification, User } from '@angular/fire/auth';
import { ErrorMessageService } from '../../services/error-message.service'; 
import { TranslationService } from '../../services/translation.service';
import { sendPasswordResetEmail } from 'firebase/auth';


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
  isRegistered: boolean = false;
  loginError: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private errorMessageService: ErrorMessageService,
    public translationService: TranslationService
  ) {}

  async submit() {
    this.loginError = null;
    const auth = getAuth();
    let user: User | null = auth.currentUser;

    try {
      console.log('Submit button clicked.');

      if (this.isRegistering) {
        console.log('Registering user...');
        await this.authService.register(this.email, this.password);
        this.isRegistered = true;
        this.loginError = 'Registration successful! Please check your email to verify your account.';
      } else {
        console.log('Logging in user...');
        await this.authService.login(this.email, this.password);
      }

      user = auth.currentUser;
      if (user) {
        console.log('Current user:', user);

        if (!user.emailVerified) {
          console.log('User email not verified. Prompting verification.');
          this.loginError = 'Please verify your email before logging in.';

          
          if (this.isRegistering) {
            await sendEmailVerification(user); 
            console.log('Verification email sent!');
          }

          
          onAuthStateChanged(auth, (user) => {
            console.log('onAuthStateChanged triggered. User state:', user);
            if (user && user.emailVerified) {
              console.log('Email verified, redirecting to /home-auth.');
              this.router.navigate(['/home-auth']);
            }
          });
          return;  
        }

        console.log('Email is already verified, navigating to /home-auth.');
        this.router.navigate(['/home-auth']);
      } else {
        console.log('No user found.');
      }
      
    } catch (error: any) {
      console.error('Firebase Error:', error);
      
      this.loginError = this.errorMessageService.getFriendlyErrorMessage(error);
    }
  }

  
  
  resetError() {
    this.loginError = null;
  }

  toggleMode() {
    this.isRegistering = !this.isRegistering;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth']);  
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}
