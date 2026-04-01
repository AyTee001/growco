import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AddressSelectorComponent } from './address-selector/address-selector';
import { TimeSlotPickerComponent, TimeSlot } from './time-slot-picker/time-slot-picker';
import { ContactBlockComponent } from './contact-block/contact-block';
import { PaymentMethodComponent, PaymentMethod } from './payment-method/payment-method';
import { BasketService } from '../shared/header/basket/basket.service';

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [
    CommonModule,
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
  public basketService = inject(BasketService);
  private router = inject(Router);

  selectedAddress: string | null = null;
  selectedTimeSlot: TimeSlot | null = null;
  selectedPayment = 'cash_on_pickup';
  orderComment = '';
  noPaperReceipt = false;

  timeSlots: TimeSlot[] = [
    { id: 1, time: '09:00 - 10:00' },
    { id: 2, time: '10:00 - 11:00' },
    { id: 3, time: '11:00 - 12:00' },
    { id: 4, time: '12:00 - 13:00' },
    { id: 5, time: '13:00 - 14:00' },
    { id: 6, time: '14:00 - 15:00' },
  ];

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

  addresses = [
    'вул. Головна, 123',
    'вул. Садова, 45',
    'просп. Лесі Українки, 7',
    'площа Ринок, 1'
  ];

  goBack() {
    this.router.navigate(['/']);
  }

  onAddressSelected(address: string) {
    this.selectedAddress = address;
  }

  onTimeSlotSelected(slot: TimeSlot) {
    this.selectedTimeSlot = slot;
  }

  onProfileChanged(data: { name: string; phone: string }) {
    this.userName = data.name;
    this.userPhone = data.phone;
  }

  onFormDataChanged(data: { comment: string; noPaperReceipt: boolean }) {
    this.orderComment = data.comment;
    this.noPaperReceipt = data.noPaperReceipt;
  }

  onPaymentChange(value: string) {
    this.selectedPayment = value;
  }

  async confirmOrder() {
    if (!this.selectedAddress || !this.selectedTimeSlot) {
      alert('Будь ласка, виберіть адресу та час доставки');
      return;
    }

    const orderPayload = {
      items: this.basketService.cartSubject?.value?.cartItems ?? [],
      totalAmount: this.basketService.getTotalToPay(),

      // From Checkout Context
      deliveryAddress: this.selectedAddress,
      deliveryTime: this.selectedTimeSlot.time,
      customerName: this.userName,
      customerPhone: this.userPhone,
      paymentMethod: this.selectedPayment,
      comment: this.orderComment,
      isPaperless: this.noPaperReceipt,
    };

    console.log('Final Order Payload ready for Backend:', orderPayload);
  }
}