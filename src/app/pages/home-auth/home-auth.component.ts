import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { TranslationService } from '../../services/translation.service';
import { Database, ref, set, get, child, update } from '@angular/fire/database';
import { getAuth, User } from '@angular/fire/auth';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-auth',
  standalone: true,
  imports: [FormsModule, CommonModule], 
  templateUrl: './home-auth.component.html',
  styleUrls: ['./home-auth.component.css']
})
export class HomeAuthComponent implements OnInit {
  email: string | null = null;
  selectedLanguage: string = 'english'; 
  isModalOpen: boolean = false;
  resetEmail: string = '';

  languages = [
    { code: 'english', name: 'English' },
    { code: 'french', name: 'Français' },
    { code: 'romanian', name: 'Română' }
  ];

  constructor(
    public translationService: TranslationService,
    private authService: AuthService,
    private database: Database
  ) {}

  async ngOnInit(): Promise<void> {
    const auth = getAuth();
    const user: User | null = auth.currentUser;

    if (user) {
      this.email = user.email;

      if (this.email) {
        const dbRef = ref(this.database, 'users/' + this.email.replace(/\./g, '_')); 
        try {
          const snapshot = await get(child(dbRef, 'language'));
          if (snapshot.exists()) {
            this.selectedLanguage = snapshot.val();
          } else {
            
            await set(dbRef, { language: this.selectedLanguage });
          }
        } catch (error) {
          console.error('Error fetching data from Realtime Database:', error);
        }
      }
    }
  }

  async updateLanguage() {
    if (this.email) {
      const dbRef = ref(this.database, 'users/' + this.email.replace(/\./g, '_'));
      await update(dbRef, { language: this.selectedLanguage });
      this.translationService.setLanguage(this.selectedLanguage);
    }
  }

  openResetPasswordModal() {
    this.isModalOpen = true;
  }

  closeResetPasswordModal() {
    this.isModalOpen = false;
  }

  async resetPassword() {
    if (this.resetEmail) {
      try {
        await this.authService.resetPassword(this.resetEmail);
        alert(this.translationService.getTranslation('home.resetPasswordSuccess'));
        this.closeResetPasswordModal();
      } catch (error) {
        alert(this.translationService.getTranslation('home.resetPasswordError'));
      }
    }
  }
}
