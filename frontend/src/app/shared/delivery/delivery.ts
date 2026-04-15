import { ChangeDetectorRef, Component, inject, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import * as L from 'leaflet';
import { FormsModule } from '@angular/forms';
import { storesControllerFindAll } from '../../client';

export interface StoreLocation {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  workingHours: string;
}

@Component({
  selector: 'delivery',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatIconModule, FormsModule],
  templateUrl: './delivery.html',
  styleUrls: ['./delivery.scss']
})
export class Delivery implements OnInit, AfterViewInit {
  private map!: L.Map;
  private cdr = inject(ChangeDetectorRef);

  storeLocations: StoreLocation[] = [];
  filteredStores: StoreLocation[] = [];
  searchQuery = '';
  selectedStore: StoreLocation | null = null;

  async ngOnInit() {
    const saved = localStorage.getItem('selectedStore');
    if (saved) {
      this.selectedStore = JSON.parse(saved);
    }

    await this.loadStores();
  }

  ngAfterViewInit(): void {
    this.initMapBase();

    if (this.storeLocations.length > 0) {
      this.addMarkers();
    }
  }

  private async loadStores() {
    const { data, error } = await storesControllerFindAll();

    if (error || !data) {
      console.error('Failed to load stores:', error);
      return;
    }

    this.storeLocations = data.map((store: any) => ({
      id: store.storeId.toString(),
      name: store.name,
      address: `м. ${store.city}, ${store.street}, ${store.houseNumber}`,
      workingHours: store.workingHours,
      lat: store.lat ? Number(store.lat) : 50.4501 + (Math.random() * 0.05),
      lng: store.lng ? Number(store.lng) : 30.5234 + (Math.random() * 0.05),
    }));

    this.filteredStores = [...this.storeLocations];

    this.cdr.detectChanges();

    if (this.map) {
      this.addMarkers();
    }
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

    if (this.map) {
      this.map.flyTo([store.lat, store.lng], 14);
    }
  }

  private initMapBase(): void {
    this.map = L.map('pickup-map', {
      center: [50.4501, 30.5234], // Center of Kyiv
      zoom: 11
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);
  }

  private addMarkers(): void {
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
            <span style="color: #888; font-size: 11px;">🕒 ${store.workingHours}</span><br>
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