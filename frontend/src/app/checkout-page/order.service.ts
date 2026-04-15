import { Injectable } from '@angular/core';
import { ordersControllerCreate } from '../client';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  async create(payload: any): Promise<any> {
    return await ordersControllerCreate({ body: payload });
  }
}
