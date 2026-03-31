import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AddressSelectorComponent } from './address-selector/address-selector';
import { TimeSlotPickerComponent, TimeSlot } from './time-slot-picker/time-slot-picker';
import { ContactBlockComponent } from './contact-block/contact-block';
import { PaymentMethodComponent, PaymentMethod } from './payment-method/payment-method';

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatIconModule,
    AddressSelectorComponent,
    TimeSlotPickerComponent,
    ContactBlockComponent,
    PaymentMethodComponent
  ],
  templateUrl: './checkout-page.html',
  styleUrls: ['./checkout-page.scss']
})
export class CheckoutPageComponent {
  timeSlots: TimeSlot[] = [
    { id: 1, time: '09:00 - 10:00' },
    { id: 2, time: '10:00 - 11:00' },
    { id: 3, time: '11:00 - 12:00' },
    { id: 4, time: '12:00 - 13:00' },
    { id: 5, time: '13:00 - 14:00' },
    { id: 6, time: '14:00 - 15:00' },
  ];

  selectedTimeSlot: TimeSlot | null = null;

  userName = 'Іван Петренко';
  userPhone = '+380 99 123 45 67';

  paymentMethods: PaymentMethod[] = [
    {
      id: 'cash_on_pickup',
      label: 'Оплата на касі',
      icon: 'point_of_sale',
      value: 'cash_on_pickup'
    }
  ];
  selectedPayment = 'cash_on_pickup';

  addresses = [
    'вул. Головна, 123',
    'вул. Садова, 45',
    'просп. Лесі Українки, 7',
    'площа Ринок, 1'
  ];

  constructor(private router: Router) {}

  goBack() {
    this.router.navigate(['/']);
  }

  onAddressSelected(address: string) {
    console.log('Вибрано адресу:', address);
  }

  onTimeSlotSelected(slot: TimeSlot) {
    this.selectedTimeSlot = slot;
    console.log('Вибрано час:', slot);
  }

  onProfileChanged(data: { name: string; phone: string }) {
    this.userName = data.name;
    this.userPhone = data.phone;
    console.log('Профіль оновлено:', data);
  }

  onFormDataChanged(data: { comment: string; noPaperReceipt: boolean }) {
    console.log('Дані форми змінено:', data);
  }

  onPaymentChange(value: string) {
    console.log('Вибрано спосіб оплати:', value);
  }
}