import { Component, OnInit , ChangeDetectorRef} from '@angular/core';
import { ConfigService, Config, MenuItem, Language } from '../../services/config.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PipesModule } from '../../pipes/pipes.module';
import { TranslationService } from '../../services/translation.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule, PipesModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  menu: MenuItem[] = [];
  sticky = false;
  languages: Language[] = [];
  currentLanguage = 'English';
  languageSwitcherEnabled = false;
  isLoggedIn = false;
  private authSubscription: Subscription | null = null; 

  constructor(
    private configService: ConfigService,
    private translationService: TranslationService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.authSubscription = this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status; 
      this.cdr.detectChanges();
      this.loadMenu();
    });
    
    this.configService.getConfig().subscribe((config: Config) => {
      this.menu = config.menu.filter((item: MenuItem) => item.enabled);
      this.sticky = config.header.sticky;

      if (config.languageSwitcher) {
        this.languageSwitcherEnabled = config.languageSwitcher.enabled;
        this.languages = config.languageSwitcher.languages.filter((lang: Language) => lang.enabled);
      }
    });

    
    this.isLoggedIn = this.authService.isLoggedIn();
    
  }


  private loadMenu(): void {
    this.configService.getConfig().subscribe((config) => {
      this.menu = config.menu.map(item => {
        if (item.route === "/home" && this.authService.isLoggedIn()) {
          return { ...item, route: "/home-auth" }; 
        }
        console.log("Changed menu items routes")
        return item;
      });
    });
  }


  goToLogin(): void {
    this.router.navigate(['/auth']);
  }
  
  logout(): void {
    this.authService.logout().then(() => {
      console.log('User logged out');
      localStorage.removeItem('authToken'); 
      this.isLoggedIn = false;
      this.router.navigate(['/auth']);
    }).catch((error) => {
      console.error('Logout failed', error);
    });
  }

  changeLanguage(event: Event): void {
    const selectElement = event.target as HTMLSelectElement | null;
    if (selectElement) { 
      const selectedLanguage = selectElement.value;
      console.log(`Language switched to: ${selectedLanguage}`);
      this.translationService.setLanguage(selectedLanguage); 
    } else {
      console.error('Event target is null. Unable to change language.');
    }
  }
}
