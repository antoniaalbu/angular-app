import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../../services/config.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

interface MenuItem {
  name: string;
  route: string;
  enabled: boolean;
}

interface FooterConfig {
  sticky: boolean;
  transparent: boolean;
}

interface Config {
  menu: MenuItem[];
  footer: FooterConfig;
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  menu: MenuItem[] = [];
  sticky = false;
  transparent = false;

  constructor(private configService: ConfigService) {}

  ngOnInit(): void {
    this.configService.getConfig().subscribe((config: Config) => {
      this.menu = config.menu.filter((item: MenuItem) => item.enabled);
      this.sticky = config.footer.sticky;
      this.transparent = config.footer.transparent;
    });
  }
}
