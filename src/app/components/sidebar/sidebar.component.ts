import { Component, OnInit } from '@angular/core';
import { ConfigService, MenuItem } from '../../services/config.service';
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
  submenu: { [key: string]: string[] } = {};  
  menu: MenuItem[] = []; 

  constructor(private configService: ConfigService) {}

  ngOnInit(): void {
    this.configService.getConfig().subscribe(config => {
      this.menu = config.menu.filter(item => item.enabled);  
      this.submenu = config.sidebar.submenu;  
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
}
