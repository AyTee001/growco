import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from './auth.service';

const STORAGE_KEY = 'growco_user_profile_v1';

export interface UserProfile {
  fullName: string;
  birthDate: string;
  gender: string;
  phone: string;
  email: string;
  avatarDataUrl: string | null;
}

const emptyProfile = (): UserProfile => ({
  fullName: '',
  birthDate: '',
  gender: '',
  phone: '',
  email: '',
  avatarDataUrl: null
});

function decodeJwtPayload(token: string): { sub?: string; email?: string } | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

@Injectable({ providedIn: 'root' })
export class UserProfileService {
  private readonly profileSubject = new BehaviorSubject<UserProfile>(emptyProfile());

  constructor(private auth: AuthService) {
    this.loadFromStorage();
    this.syncEmailFromToken();
  }

  get profile$(): Observable<UserProfile> {
    return this.profileSubject.asObservable();
  }

  getProfileSnapshot(): UserProfile {
    return { ...this.profileSubject.value };
  }

  syncEmailFromToken(): void {
    const token = this.auth.getToken();
    if (!token) return;
    const payload = decodeJwtPayload(token);
    if (!payload?.email) return;
    const current = this.profileSubject.value;
    if (current.email && current.email.trim()) return;
    this.patchProfile({ email: payload.email });
  }

  patchProfile(partial: Partial<UserProfile>): void {
    const next = { ...this.profileSubject.value, ...partial };
    this.profileSubject.next(next);
    this.persist(next);
  }

  setAvatarDataUrl(dataUrl: string | null): void {
    this.patchProfile({ avatarDataUrl: dataUrl });
  }

  private loadFromStorage(): void {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<UserProfile>;
      const base = emptyProfile();
      this.profileSubject.next({
        ...base,
        ...parsed,
        avatarDataUrl: parsed.avatarDataUrl ?? null
      });
    } catch {
      this.profileSubject.next(emptyProfile());
    }
  }

  private persist(profile: UserProfile): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch {
      /* ignore quota */
    }
  }
}
