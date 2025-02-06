import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedInSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
  public isLoggedIn$ = this.loggedInSubject.asObservable();

  constructor(private auth: Auth) {}

  async login(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      const token = await userCredential.user.getIdToken();
      localStorage.setItem('authToken', token);
      localStorage.setItem('userEmail', email);
      this.loggedInSubject.next(true); // Notify subscribers
    } catch (error: any) {
      throw new Error(error?.message || 'An error occurred during login.');
    }
  }

  async register(email: string, password: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const token = await userCredential.user.getIdToken();
      localStorage.setItem('authToken', token);
      localStorage.setItem('userEmail', email);
      this.loggedInSubject.next(true); // Notify subscribers
    } catch (error: any) {
      throw new Error(error?.message || 'An error occurred during registration.');
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
      this.loggedInSubject.next(false); // Notify subscribers
    } catch (error: any) {
      throw new Error(error?.message || 'An error occurred during logout.');
    }
  }
}
