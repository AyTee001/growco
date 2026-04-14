import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { AuthInterceptor } from './core/auth.interceptor';
import { routes } from './app.routes';
import { client } from './client/client.gen';
import { CategoryService } from './shared/services/category.service';

function initializeCategories(categoryService: CategoryService) {
  return () => categoryService.init();
}

client.setConfig({ baseUrl: '/api' });
client.interceptors.request.use((request) => {
  const token = localStorage.getItem('access_token');
  
  if (token) {
    request.headers.set('Authorization', `Bearer ${token}`);
  }
  
  return request;
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'uk' },
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeCategories,
      deps: [CategoryService],
      multi: true,
    }
  ]
};