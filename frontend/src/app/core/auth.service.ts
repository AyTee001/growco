import { Injectable } from '@angular/core';
import { client } from '../client/client.gen';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  phoneNumber: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
}

interface DecodedToken {
  sub: number;
  email: string;
  name: string;
  role?: string;
  iat?: number;
  exp?: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'access_token';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.isAuthenticated());
  private userNameSubject = new BehaviorSubject<string | null>(this.getUserNameFromToken());

  constructor(private router: Router) {}

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return from(client.post({
      url: '/auth/login',
      body: credentials
    })).pipe(
      map(response => response.data as AuthResponse),
      tap(response => this.setToken(response.access_token))
    );
  }

  register(user: RegisterRequest): Observable<AuthResponse> {
    return from(client.post({
      url: '/auth/register',
      body: user
    })).pipe(
      map(response => response.data as AuthResponse),
      tap(response => this.setToken(response.access_token))
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.isAuthenticatedSubject.next(false);
    this.userNameSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        this.logout();
        return false;
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  isAuthenticated$(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  get userName$(): Observable<string | null> {
    return this.userNameSubject.asObservable();
  }

  private getUserNameFromToken(): string | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      return decoded.name || null;
    } catch (e) {
      return null;
    }
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    this.isAuthenticatedSubject.next(true);
    this.userNameSubject.next(this.getUserNameFromToken());
  }
}