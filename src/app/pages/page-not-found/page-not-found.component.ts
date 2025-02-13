import { Component, OnDestroy } from '@angular/core';
import { TranslationService } from '../../services/translation.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.css']
})
export class PageNotFoundComponent implements OnDestroy {
  private langSubscription!: Subscription;

  constructor(public translationService: TranslationService) {
    this.langSubscription = this.translationService.currentLanguage$.subscribe(() => {
      // Force component to update translation when language changes
    });
  }

  ngOnDestroy(): void {
    this.langSubscription.unsubscribe();
  }
}
