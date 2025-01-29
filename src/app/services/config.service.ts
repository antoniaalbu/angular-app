import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

export interface MenuItem {
  name: string;
  route: string;
  enabled: boolean;
}

export interface FooterConfig {
  sticky: boolean;
  transparent: boolean;
}

export interface SidebarConfig {
  enabled: boolean;
  submenu: { [key: string]: string[] };
}

export interface Language {
  name: string;
  enabled: boolean;
}

export interface Config {
  menu: MenuItem[];
  header: {
    sticky: boolean;
    transparent: boolean;
  };
  footer: FooterConfig;
  sidebar: SidebarConfig;
  languageSwitcher: {
    enabled: boolean;
    languages: Language[];
  };
}


interface Translations {
  [key: string]: { [key: string]: string };  
}

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private configUrl = 'menu-config.json'; 
  private languageUrl = 'i18n';  
  private currentLanguageSubject = new BehaviorSubject<string>('English');
  private translations: Translations = {};  

  constructor(private http: HttpClient) {}


  getConfig(): Observable<Config> {
    return this.http.get<Config>(this.configUrl);
  }

  
  getTranslations(language: string): Observable<any> {
    if (this.translations[language]) {
      return new BehaviorSubject(this.translations[language]).asObservable();
    }
    
    return this.http.get(`${this.languageUrl}${language.toLowerCase()}.json`);
  }

  
  setCurrentLanguage(language: string): void {
    this.currentLanguageSubject.next(language);
    this.loadTranslations(language);
  }

  
  private loadTranslations(language: string): void {
    this.getTranslations(language).subscribe((translations) => {
      this.translations[language] = translations;
    });
  }

 
  getCurrentLanguage(): string {
    return this.currentLanguageSubject.value;
  }


  get languageChanges$() {
    return this.currentLanguageSubject.asObservable();
  }
}
