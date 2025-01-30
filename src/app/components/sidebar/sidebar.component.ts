import { Component, OnInit } from '@angular/core';
import { ConfigService, MenuItem } from '../../services/config.service';
import { TranslationService } from '../../services/translation.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  isSidebarActive = false;
  submenu: { [key: string]: { items: string[], isVisible: boolean } } = {}; 
  menu: MenuItem[] = [];
  isTranslationsLoaded: boolean = false;
  activeSubmenu: string | null = null;

  constructor(
    private configService: ConfigService,
    private translationService: TranslationService
  ) {}

  ngOnInit(): void {
   
    this.translationService.isTranslationsLoaded$.subscribe(isLoaded => {
      if (isLoaded) {
        this.isTranslationsLoaded = true;
        this.loadConfig();  
      }
    });

   
    const currentLanguage = this.translationService.currentLanguage;  
    this.translationService.loadTranslationsForComponent(currentLanguage); 
  }

  private loadConfig(): void {
    this.configService.getConfig().subscribe(config => {
      
      this.menu = config.menu.filter(item => item.enabled).map(item => ({
        ...item,
        originalName: item.name, 
        name: '' 
      }));
  
      this.submenu = {};
      Object.keys(config.sidebar.submenu).forEach(route => {
        this.submenu[route] = {
          items: config.sidebar.submenu[route], 
          isVisible: false
        };
      });
  
      this.translateSidebar();
    });
  }

  toggleSidebar() {
    this.isSidebarActive = !this.isSidebarActive;
    if (this.isSidebarActive) {
      document.body.classList.add('sidebar-active');
    } else {
      document.body.classList.remove('sidebar-active');
    }
  }

  toggleSubmenu(route: string) {
   
    const submenu = this.submenu[route];
    if (submenu) {
      submenu.isVisible = !submenu.isVisible;
    }
  }

  private translateSidebar(): void {
    
    this.menu.forEach(item => {
      const translatedName = this.translationService.getTranslation(item.name);
      console.log(`Translated menu item '${item.name}' to '${translatedName}'`);
      item.name = translatedName;
    });
  
   
    Object.keys(this.submenu).forEach(route => {
      console.log(`Translating submenu for route: ${route}`);
  
     
      const submenuTranslations = this.translationService.currentTranslations?.submenu?.[route];
  
      if (submenuTranslations) {
     
        this.submenu[route].items = this.submenu[route].items.map(subItem => {
          const translatedSubItem = submenuTranslations[subItem] || subItem;
          console.log(`Translated submenu item '${subItem}' to '${translatedSubItem}'`);
          return translatedSubItem;
        });
      } else {
        console.log(`No translations found for submenu items under route: ${route}`);
      }
    });
  }

  showSubmenu(route: string) {
    if (this.submenu[route]) {
      this.activeSubmenu = route;
    }
  }

  hideSubmenu() {
    this.activeSubmenu = null;
  }
}
