import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../../services/config.service';
import { TranslationService } from '../../services/translation.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  sticky = false;
  transparent = false;
  footerText = '© 2025 My Footer'; // Default text if translations are not available yet

  constructor(
    private configService: ConfigService,
    private translationService: TranslationService
  ) {}

  ngOnInit(): void {
    // Load footer configuration
    this.configService.getConfig().subscribe((config) => {
      this.sticky = config.footer.sticky;
      this.transparent = config.footer.transparent;
    });

    // Subscribe to translation loading state
    this.translationService.isTranslationsLoaded$.subscribe((isLoaded) => {
      if (isLoaded) {
        // If translations are loaded, set footer text
        this.updateFooterText();
      }
    });

    // Ensure translation is set immediately if already loaded
    if (this.translationService.getTranslation('footer.copyright')) {
      this.updateFooterText();
    }
  }

  private updateFooterText(): void {
    this.footerText = this.translationService.getTranslation('footer.copyright');
  }
}
