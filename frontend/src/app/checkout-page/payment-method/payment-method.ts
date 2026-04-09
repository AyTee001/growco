import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';

export interface PaymentMethod {
  id: string;
  label: string;
  icon: string;
  value: string;
}

@Component({
  selector: 'app-payment-method',
  standalone: true,
  imports: [CommonModule, FormsModule, MatRadioModule, MatIconModule],
  templateUrl: './payment-method.html',
  styleUrls: ['./payment-method.scss']
})
export class PaymentMethodComponent {
  @Input() methods: PaymentMethod[] = [];
  @Input() selectedValue: string | null = null;
  @Output() selectedValueChange = new EventEmitter<string>();

  onSelectionChange(value: string): void {
    this.selectedValue = value;
    this.selectedValueChange.emit(value);
  }
}