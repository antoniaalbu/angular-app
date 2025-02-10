import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ErrorMessageService {

  constructor() {}

  
  getFriendlyErrorMessage(error: any, context?: string): string {
    console.log('Raw Error:', error);
    
    
    const match = error?.message?.match(/\(auth\/([^)]+)\)/);
    if (match) {
      const errorCode = `auth/${match[1]}`;
      console.log('Firebase Error Code:', errorCode);
      return this.getFirebaseErrorMessage(errorCode);
    }

    
    if (error?.status && error?.statusText) {
      return `API Error: ${error.status} - ${error.statusText}. ${context ? `Context: ${context}` : ''}`;
    }

    
    if (error?.message) {
      return error.message;
    }

    
    return `An unknown error occurred. Please try again later. ${context ? `Context: ${context}` : ''}`;
  }

  
  private getFirebaseErrorMessage(errorCode: string): string {
    const errorMessages: { [key: string]: string } = {
      'auth/invalid-credential': 'Invalid email or password. Please try again.',
      'auth/invalid-email': 'Invalid email format. Please enter a valid email.',
      'auth/user-not-found': 'No account found with this email. Please sign up.',
      'auth/wrong-password': 'Incorrect password. Please try again.',
      'auth/email-already-in-use': 'This email is already registered. Please log in.',
      'auth/weak-password': 'Password is too weak. Use at least 6 characters.',
      'auth/network-request-failed': 'Network error. Please check your connection.',
      'auth/too-many-requests': 'Too many failed attempts. Try again later.',
      'auth/internal-error': 'An unexpected error occurred. Please try again.',
    };
    return errorMessages[errorCode] || `Unknown Firebase error: ${errorCode}`;
  }
}
