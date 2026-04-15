import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './core/auth.interceptor';
import { routes } from './app.routes';
import { client } from './client/client.gen';
import { CategoryService } from './shared/services/category.service';

function initializeCategories(categoryService: CategoryService) {
  return () => categoryService.init();
}

client.setConfig({ baseUrl: '/api' });

export const appConfig: ApplicationConfig = {
  providers: [
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