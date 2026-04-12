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
import { DeliverySlots, deliverySlotsControllerFindByDate, Stores, } from '../client';
import { ordersControllerCreate, storesControllerFindAll } from '../client';

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

  addresses: string[] = [];
  selectedAddress: string = '';
  selectedTimeSlot: TimeSlot | null = null;
  selectedPayment = 'cash_on_pickup';

  async ngOnInit() {
    await this.generateDateOptions();

    if (this.selectedDate()) {
      await Promise.all([
        this.loadDeliverySlots(),
        this.loadStores()
      ]);
    } else {
      await this.loadStores();
    }
  }

  private async generateDateOptions() {
    const options: DateOption[] = [];
    const now = new Date();

    const potentialDates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(now.getDate() + i);
      potentialDates.push(d);
    }

    const fetchPromises = potentialDates.map(d => {
      const dateStr = d.toISOString().split('T')[0];
      return deliverySlotsControllerFindByDate({ query: { date: dateStr } })
        .then(res => ({ date: d, dateStr, res }));
    });

    const results = await Promise.all(fetchPromises);

    for (const item of results) {
      if (options.length >= 5) break;

      if (!item.res.error && item.res.data) {
        const isToday = item.dateStr === now.toISOString().split('T')[0];

        const validSlots = item.res.data.filter((slot: any) => {
          if (isToday) {
            return new Date(slot.endTime) > now;
          }
          return true;
        });

        if (validSlots.length > 0) {
          let label = item.date.toLocaleDateString('uk-UA', { weekday: 'short', day: 'numeric', month: 'short' });

          const todayStr = now.toISOString().split('T')[0];
          const tomorrow = new Date(now);
          tomorrow.setDate(now.getDate() + 1);
          const tomorrowStr = tomorrow.toISOString().split('T')[0];

          if (item.dateStr === todayStr) label = 'Сьогодні';
          else if (item.dateStr === tomorrowStr) label = 'Завтра';

          options.push({ label, value: item.dateStr });
        }
      }
    }

    this.dateOptions = options;

    if (this.dateOptions.length > 0) {
      this.selectedDate.set(this.dateOptions[0].value);
    }
  }
  private async loadStores() {
    const { data, error } = await storesControllerFindAll();

    if (error || !data) {
      console.error('Failed to load stores:', error);
      this.addresses = ['Магазин тимчасово недоступний'];
      return;
    }

    this.addresses = data.map((store: any) => {
      return `${store.name} — м. ${store.city}, ${store.street}, ${store.houseNumber} (${store.workingHours})`;
    });

    if (this.addresses.length > 0) {
      this.selectedAddress = this.addresses[0];
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
      const { data, error } = await ordersControllerCreate({ body: orderPayload });

      if (error) {
        console.error('Помилка при створенні замовлення:', error);
        alert('Не вдалося оформити замовлення. Спробуйте пізніше.');
        return;
      }

      console.log('Замовлення успішно створено:', data);

      this.router.navigate(['/success']);
      this.basketService.refreshCart();
    } catch (err) {
      console.error('Системна помилка:', err);
      alert('Сталася непередбачувана помилка');
    }
  }
}
