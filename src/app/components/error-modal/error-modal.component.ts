import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error-modal',
  standalone: true,
  templateUrl: './error-modal.component.html',
  styleUrls: ['./error-modal.component.css'],
  imports: [CommonModule]
})
export class ErrorModalComponent implements OnInit {
  @Input() errorMessage: string | null = null;
  @Output() close = new EventEmitter<void>();

  ngOnInit(): void {
  
    console.log('ErrorModalComponent initialized with errorMessage:', this.errorMessage);
  }

  closeModal(): void {
    this.close.emit();
  }
}
