import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import * as L from 'leaflet';

@Component({
  selector: 'delivery',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatIconModule],
  templateUrl: './delivery.html',
  styleUrls: ['./delivery.scss']
})
export class Delivery {
private map!: L.Map;

  storeLocations = [
    { name: 'Growco Хрещатик', lat: 50.4488, lng: 30.5222 },
    { name: 'Growco Поділ', lat: 50.4654, lng: 30.5123 },
    { name: 'Growco Дарниця', lat: 50.4556, lng: 30.6125 }
  ];

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('pickup-map', {
      center: [ 50.4501, 30.5234 ],
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
      L.marker([store.lat, store.lng], { icon: iconDefault })
        .addTo(this.map)
        .bindPopup(`<b>${store.name}</b>`);
    });
  }}