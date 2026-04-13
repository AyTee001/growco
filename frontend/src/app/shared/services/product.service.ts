import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Products } from '../client';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);

  getCollection(slug: string): Observable<Products[]> {
    return this.http.get<Products[]>(`/api/products/collection/${slug}`);
  }
}
