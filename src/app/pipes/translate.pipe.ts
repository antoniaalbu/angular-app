import { Pipe, PipeTransform } from '@angular/core';
import { TranslationService } from '../services/translation.service';

@Pipe({
  name: 'translate',
  pure: false  // Ensures updates happen when language changes
})
export class TranslatePipe implements PipeTransform {
  constructor(private translationService: TranslationService) {}

  transform(value: string): string {
    if (!value) return '';  // Handle empty values gracefully

    const translatedValue = this.translationService.getTranslation(value);
    return translatedValue || value; // If no translation is found, return the key itself
  }
}
