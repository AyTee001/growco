import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-address-selector',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './address-selector.html',
  styleUrls: ['./address-selector.scss']
})
export class AddressSelectorComponent {
  @Input() addresses: string[] = [];
  @Output() addressSelected = new EventEmitter<string>();

  isOpen = false;
  currentAddress = 'вул. Головна, 123';

  openModal() {
    this.isOpen = true;
  }

  closeModal() {
    this.isOpen = false;
  }

  selectAddress(address: string) {
    this.currentAddress = address;
    this.addressSelected.emit(address);
    this.closeModal();
  }
}