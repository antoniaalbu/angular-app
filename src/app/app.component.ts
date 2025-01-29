import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { PipesModule } from './pipes/pipes.module';  // Importă PipesModule

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, SidebarComponent, PipesModule],  // Adaugă PipesModule la imports
  templateUrl: './app.component.html',
})
export class AppComponent {}
