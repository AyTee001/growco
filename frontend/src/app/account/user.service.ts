import { Injectable, signal } from '@angular/core';
import { Users } from '../client'; 

@Injectable({ providedIn: 'root' })
export class UserContextService {
  user = signal<Users | null>(null);
  isLoading = signal<boolean>(false);

  setUser(data: Users) {
    this.user.set(data);
  }
}