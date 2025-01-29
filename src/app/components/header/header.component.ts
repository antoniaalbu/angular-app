import { Component, OnInit } from '@angular/core';
import { ConfigService, Config, MenuItem, Language } from '../../services/config.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PipesModule } from '../../pipes/pipes.module';
import { TranslationService } from '../../services/translation.service';

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

  constructor(
    private configService: ConfigService,
    private translationService: TranslationService  
  ) {}

  ngOnInit(): void {
    this.configService.getConfig().subscribe((config: Config) => {
      this.menu = config.menu.filter((item: MenuItem) => item.enabled);
      this.sticky = config.header.sticky;

      if (config.languageSwitcher) {
        this.languageSwitcherEnabled = config.languageSwitcher.enabled;
        this.languages = config.languageSwitcher.languages.filter((lang: Language) => lang.enabled);
      }
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
