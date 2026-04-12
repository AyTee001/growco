import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AddressSelectorComponent } from './address-selector/address-selector';
import { TimeSlotPickerComponent, TimeSlot } from './time-slot-picker/time-slot-picker';
import { ContactBlockComponent } from './contact-block/contact-block';
import { PaymentMethodComponent, PaymentMethod } from './payment-method/payment-method';
import { BasketService } from '../shared/header/basket/basket.service';
import { firstValueFrom } from 'rxjs';
import { DeliverySlots, deliverySlotsControllerFindByDate, } from '../client';
import { ordersControllerCreate } from '../client';

interface DateOption {
  label: string;
  value: string;
}

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
export class CheckoutPageComponent implements OnInit {
  public basketService = inject(BasketService);
  private router = inject(Router);

  userName = 'Іван Петренко';
  userPhone = '+380 99 123 45 67';
  orderComment = '';
  noPaperReceipt = false;

  timeSlots = signal<TimeSlot[]>([]);
  isLoadingSlots = signal(false);

  dateOptions: DateOption[] = [];
  selectedDate = signal<string>('');

  paymentMethods: PaymentMethod[] = [
    { id: 'cash_on_pickup', label: 'Оплата на касі', icon: 'point_of_sale', value: 'cash_on_pickup' }
  ];

  addresses = [
    'вул. Головна, 123', 'вул. Садова, 45', 'просп. Лесі Українки, 7', 'площа Ринок, 1'
  ];

  selectedAddress: string = this.addresses[0];
  selectedTimeSlot: TimeSlot | null = null;
  selectedPayment = 'cash_on_pickup';

  async ngOnInit() {
    this.generateDateOptions();
    await this.loadDeliverySlots();
  }

  private generateDateOptions() {
    const options: DateOption[] = [];
    const now = new Date();
    const currentHour = now.getHours();

    const startOffset = currentHour >= 22 ? 1 : 0;

    for (let i = 0; i < 5; i++) {
      const d = new Date();
      d.setDate(now.getDate() + startOffset + i);

      let label = d.toLocaleDateString('uk-UA', { weekday: 'short', day: 'numeric', month: 'short' });

      const daysFromToday = startOffset + i;
      if (daysFromToday === 0) label = 'Сьогодні';
      if (daysFromToday === 1) label = 'Завтра';

      options.push({
        label,
        value: d.toISOString().split('T')[0]
      });
    }

    this.dateOptions = options;

    if (this.dateOptions.length > 0) {
      this.selectedDate.set(this.dateOptions[0].value);
    }
  }

  async onDateChange(dateValue: string) {
    this.selectedDate.set(dateValue);
    this.selectedTimeSlot = null;
    await this.loadDeliverySlots();
  }

  private async loadDeliverySlots() {
    this.isLoadingSlots.set(true);

    const { data, error } = await deliverySlotsControllerFindByDate({
      query: { date: this.selectedDate() }
    });

    if (error || !data) {
      this.isLoadingSlots.set(false);
      return;
    }

    const now = new Date();
    const isToday = this.selectedDate() === now.toISOString().split('T')[0];

    const mappedSlots: TimeSlot[] = data
      .map((slot: DeliverySlots) => ({
        id: slot.slotId,
        time: `${this.formatTime(slot.startTime)} - ${this.formatTime(slot.endTime)}`,
        // Keep the raw end time for comparison
        endTime: new Date(slot.endTime)
      }))
      .filter((slot: any) => {
        if (isToday) {
          return slot.endTime > now;
        }
        return true;
      });

    this.timeSlots.set(mappedSlots);
    this.isLoadingSlots.set(false);
  }

  private formatTime(dateSource: string | Date): string {
    const d = new Date(dateSource);
    return d.toLocaleTimeString('uk-UA', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  }

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

    const currentCart = await firstValueFrom(this.basketService.cart$);

    if (!currentCart || currentCart.cartItems.length === 0) {
      alert('Ваш кошик порожній');
      return;
    }

    const orderPayload = {
      items: currentCart.cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        priceAtOrder: item.product.price,
      })),
      totalAmount: this.basketService.getTotalToPay(),
      deliveryTimeRange: this.selectedTimeSlot.time,
      customerName: this.userName,
      customerPhone: this.userPhone,
      paymentMethod: this.selectedPayment,
      comment: this.orderComment,
      isPaperless: this.noPaperReceipt,
      deliveryAddress: this.selectedAddress,
      deliveryDate: this.selectedDate(),
    };

    try {
      // 1. Надсилаємо дані на бекенд
      const { data, error } = await ordersControllerCreate({ body: orderPayload });

      if (error) {
        console.error('Помилка при створенні замовлення:', error);
        alert('Не вдалося оформити замовлення. Спробуйте пізніше.');
        return;
      }

      console.log('Замовлення успішно створено:', data);

      // 3. Переходимо на сторінку успіху
      this.router.navigate(['/success']);
    } catch (err) {
      console.error('Системна помилка:', err);
      alert('Сталася непередбачувана помилка');
    }
  }
}
