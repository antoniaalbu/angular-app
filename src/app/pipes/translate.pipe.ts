import { Pipe, PipeTransform } from '@angular/core';
import { TranslationService } from '../services/translation.service';

@Pipe({
  name: 'translate',
  pure: false  
})
export class TranslatePipe implements PipeTransform {
  constructor(private translationService: TranslationService) {}

  transform(value: string): string {
    if (!value) return '';  

    const translatedValue = this.translationService.getTranslation(value);
    return translatedValue || value; 
  }
}
