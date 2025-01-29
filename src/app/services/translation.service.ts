import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private currentLanguageSubject = new BehaviorSubject<string>('English');
  currentLanguage$ = this.currentLanguageSubject.asObservable();
  private translations: { [key: string]: any } = {};
  private isLoaded = new BehaviorSubject<boolean>(false); 

  constructor(private http: HttpClient) {
    this.loadTranslations('English');
  }

  get currentLanguage(): string {
    return this.currentLanguageSubject.value;
  }

  setLanguage(language: string): void {
    this.currentLanguageSubject.next(language);
    this.loadTranslations(language);
  }

  private loadTranslations(language: string): void {
    const translationUrl = `i18n/${language.toLowerCase()}.json`; 
    this.http.get(translationUrl).subscribe(
      (translations) => {
        this.translations[language] = translations;
        this.isLoaded.next(true);  
      },
      (error) => {
        console.error(`Error loading translations for ${language}: `, error);
      }
    );
  }
  

  loadTranslationsForComponent(language: string): void {
    this.loadTranslations(language);
  }

  getTranslation(key: string): string {
    const currentLanguage = this.currentLanguageSubject.value;
    return key.split('.').reduce((obj, part) => obj?.[part], this.translations[currentLanguage]) || key;
  }
  

  get isTranslationsLoaded$(): Observable<boolean> {
    return this.isLoaded.asObservable();
  }

  get currentTranslations(): any {
    return this.translations[this.currentLanguage];
  }
}
