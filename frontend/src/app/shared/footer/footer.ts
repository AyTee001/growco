import { Component, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NgIf } from '@angular/common';

interface FooterSections {
  contacts: boolean;
  company: boolean;
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    MatIconModule,
    NgIf
  ],
  templateUrl: './footer.html',
  styleUrls: ['./footer.scss'],
})
export class Footer {
  currentYear = signal(new Date().getFullYear());

  openSections = signal<FooterSections>({
    contacts: false,
    company: false,
  });

  toggleSection(section: keyof FooterSections) {
    this.openSections.update(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  }
}