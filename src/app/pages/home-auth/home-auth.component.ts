import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home-auth.component.html',
  styleUrl: './home-auth.component.css'
})
export class HomeAuthComponent {
    email: string | null = null;  // Declare a variable to hold the email

    ngOnInit(): void {
      this.email = localStorage.getItem('userEmail'); 
    }
}
