import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut,  sendEmailVerification  } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';
import { sendPasswordResetEmail } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedInSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
  public isLoggedIn$ = this.loggedInSubject.asObservable();

  constructor(private auth: Auth) {}

  async register(email: string, password: string) {
  try {
    const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);

    // Send email verification
    await sendEmailVerification(userCredential.user);
    console.log('Verification email sent!');

    // Reload the user to get the updated state
    await userCredential.user.reload();
    const user = userCredential.user;
    console.log("User after reload:", user);

    if (user.emailVerified) {
      console.log("Email verified successfully.");
    } else {
      console.log("Email still not verified.");
    }

    // Save user token and email to localStorage
    const token = await user.getIdToken();
    localStorage.setItem('authToken', token);
    localStorage.setItem('userEmail', email);
    this.loggedInSubject.next(true); // Notify subscribers that the user is logged in
    
  } catch (error: any) {
    throw new Error(error?.message || 'An error occurred during registration.');
  }
}

async login(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
    const user = userCredential.user;
    
   
    await user.reload();

    if (!user.emailVerified) {
      throw new Error('Please verify your email before logging in.');
    }

    const token = await user.getIdToken();
    localStorage.setItem('authToken', token);
    localStorage.setItem('userEmail', email);
    
    this.loggedInSubject.next(true); 
  } catch (error: any) {
    throw new Error(error?.message || 'An error occurred during login.');
  }
}

  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }

  async logout() {
    try {
      await signOut(this.auth);
      localStorage.removeItem('authToken');
      localStorage.removeItem('userEmail');
      this.loggedInSubject.next(false); 
    } catch (error: any) {
      throw new Error(error?.message || 'An error occurred during logout.');
    }
  }

  async resetPassword(email: string): Promise<void> {
    await sendPasswordResetEmail(this.auth, email);
  }
}
