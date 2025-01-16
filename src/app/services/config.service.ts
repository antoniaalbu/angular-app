import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  submenu: { [key: string]: string[] };  // Submenu where key is the route and value is an array of submenu items
}

export interface Config {
  menu: MenuItem[];
  header: {
    sticky: boolean;
    transparent: boolean;
  };
  footer: FooterConfig;
  sidebar: SidebarConfig;  // Sidebar updated to reflect submenu structure
}

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private configUrl = 'menu-config.json';  // Make sure this path is correct

  constructor(private http: HttpClient) {}

  getConfig(): Observable<Config> {
    return this.http.get<Config>(this.configUrl); 
  }
}
