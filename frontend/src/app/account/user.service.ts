import { Injectable, signal } from '@angular/core';
import { Orders, ordersControllerFindMyOrders, Users } from '../client';

@Injectable({ providedIn: 'root' })
export class UserContextService {
    user = signal<Users | null>(null);
    orders = signal<Orders[]>([]);
    isLoading = signal<boolean>(false);

    async refreshOrders() {
        this.isLoading.set(true);
        try {
            const { data, error } = await ordersControllerFindMyOrders();
            if (data && !error) {
                this.orders.set(data);
            }
        } finally {
            this.isLoading.set(false);
        }
    }

    setUser(data: Users) {
        this.user.set(data);
    }

    clear() {
        this.user.set(null);
        this.orders.set([]);
        this.isLoading.set(false);
    }
}