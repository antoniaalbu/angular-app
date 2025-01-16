import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../../services/config.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

interface MenuItem {
  name: string;
  route: string;
  enabled: boolean;
}

interface HeaderConfig {
  sticky: boolean;
  transparent: boolean;
}

interface Config {
  menu: MenuItem[];
  header: HeaderConfig;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  menu: MenuItem[] = [];
  sticky = false;
  transparent = false;

  constructor(private configService: ConfigService) {}

  ngOnInit(): void {
    this.configService.getConfig().subscribe((config: Config) => {
      this.menu = config.menu.filter((item: MenuItem) => item.enabled);
      this.sticky = config.header.sticky;
      this.transparent = config.header.transparent;
    });
  }
  
}
