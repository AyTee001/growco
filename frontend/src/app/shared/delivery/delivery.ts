import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import * as L from 'leaflet';
import { FormsModule } from '@angular/forms';

export interface StoreLocation {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
}

@Component({
  selector: 'delivery',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatIconModule, FormsModule],
  templateUrl: './delivery.html',
  styleUrls: ['./delivery.scss']
})
export class Delivery {
  private map!: L.Map;
  private dialogRef = inject(MatDialogRef<Delivery>);
  private cdr = inject(ChangeDetectorRef);

  storeLocations: StoreLocation[] = [
    { id: '1', name: 'Growco Хрещатик', address: 'вул. Хрещатик, 15', lat: 50.4488, lng: 30.5222 },
    { id: '2', name: 'Growco Поділ', address: 'вул. Нижній Вал, 23', lat: 50.4654, lng: 30.5123 },
    { id: '3', name: 'Growco Дарниця', address: 'Броварський проспект, 18', lat: 50.4556, lng: 30.6125 }
  ];

  filteredStores: StoreLocation[] = [];
  searchQuery = '';
  selectedStore: StoreLocation | null = null;

  ngOnInit() {
    this.filteredStores = [...this.storeLocations];

    const saved = localStorage.getItem('selectedStore');
    if (saved) {
      this.selectedStore = JSON.parse(saved);
    }
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  filterStores() {
    const q = this.searchQuery.toLowerCase();
    this.filteredStores = this.storeLocations.filter(store =>
      store.name.toLowerCase().includes(q) ||
      store.address.toLowerCase().includes(q)
    );
  }

  selectStore(store: StoreLocation) {
    this.selectedStore = store;
    localStorage.setItem('selectedStore', JSON.stringify(store));
  }

  private initMap(): void {
    this.map = L.map('pickup-map', {
      center: [50.4501, 30.5234],
      zoom: 12
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    const iconDefault = L.icon({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    this.storeLocations.forEach(store => {
      const marker = L.marker([store.lat, store.lng], { icon: iconDefault })
        .addTo(this.map)
        .bindPopup(`
          <div style="text-align: center;">
            <b style="font-size: 14px;">${store.name}</b><br>
            <span style="color: #666;">${store.address}</span><br>
            <span id="select-btn-${store.id}" style="color: #5a7d62; font-weight: bold; cursor: pointer; display: inline-block; margin-top: 8px;">
              Обрати цей магазин
            </span>
          </div>
        `);

      marker.on('popupopen', () => {
        const selectBtn = document.getElementById(`select-btn-${store.id}`);

        if (selectBtn) {
          selectBtn.addEventListener('click', () => {
            this.selectStore(store);
            this.cdr.detectChanges();
          });
        }
      });
    });
  }
}