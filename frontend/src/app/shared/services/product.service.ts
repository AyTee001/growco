import { Injectable } from '@angular/core';
import { productsControllerFindCollection, productsControllerFindAll, Products } from '../../client';
import { from, Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductService {
  
  /**
   * Get all products (used for slicing into carousels in the current requirement)
   */
  getAllProducts(): Observable<Products[]> {
    // We wrap the promise from hey-api into an Observable to keep it consistent with Angular patterns if needed,
    // or we could just use async/await in the component. 
    // Given the user wants to see hey-api usage, I'll provide a wrapper.
    return from(productsControllerFindAll()).pipe(
      map(response => response.data || [])
    );
  }

  getCollection(slug: string): Observable<Products[]> {
    return from(productsControllerFindCollection({
      path: { slug }
    })).pipe(
      map(response => response.data || [])
    );
  }
}
