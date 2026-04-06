import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom, map } from 'rxjs';
import { Category } from '../main-menu/interfaces';

export interface Breadcrumb {
    name: string;
    id?: number;
}

@Injectable({ providedIn: 'root' })
export class CategoryService {
    private http = inject(HttpClient);

    private _categoryTree = signal<Category[]>([]);

    readonly categoryTree = this._categoryTree.asReadonly();

    async init(): Promise<void> {
        const request$ = this.http.get<Category[]>('/api/categories').pipe(
            map(data => this.buildTree(data))
        );
        const tree = await lastValueFrom(request$);
        this._categoryTree.set(tree);
    }
    
    private buildTree(flatData: Category[]): Category[] {
        const roots = flatData.filter(item => item.parentCategoryId === null);
        return roots.map(parent => ({
            ...parent,
            subCategories: flatData.filter(child => child.parentCategoryId === parent.categoryId)
        }));
    }

    getCategoryName(id: number): string | undefined {
        for (const cat of this._categoryTree()) {
            if (cat.categoryId === id) return cat.name;
            const sub = cat.subCategories?.find(s => s.categoryId === id);
            if (sub) return sub.name;
        }
        return undefined;
    }

    getCategoryPath(id: number): Breadcrumb[] {
        const tree = this.categoryTree();
        const path: Breadcrumb[] = [{ name: 'Каталог', id: undefined }];

        for (const parent of tree) {
            if (parent.categoryId === id) {
                path.push({ name: parent.name, id: parent.categoryId });
                return path;
            }

            const sub = parent.subCategories?.find(s => s.categoryId === id);
            if (sub) {
                path.push({ name: parent.name, id: parent.categoryId });
                path.push({ name: sub.name, id: sub.categoryId });
                return path;
            }
        }

        return path;
    }
}