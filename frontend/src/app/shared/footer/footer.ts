import { Component, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './footer.html',
  styleUrl: './footer.scss'
})
export class Footer {
  currentYear = signal(new Date().getFullYear());

  leftLinks = [
    { icon: 'info', label: 'Про нас', link: '#' },
    { icon: 'work', label: 'Кар’єра', link: '#' },
    { icon: 'event', label: 'Новини', link: '#' },
    { icon: 'article', label: 'Блог', link: '#' },
    { icon: 'groups', label: 'Наша команда', link: '#' }
  ];

  rightLinks = [
    { icon: 'chat', label: 'Підтримка', link: '#' },
    { icon: 'mail', label: 'Проконтактуйте з нами', link: '#' },
    { icon: 'shield', label: 'Політика конфіденційності', link: '#' },
    { icon: 'gavel', label: 'Умови користування сервісом', link: '#' },
    { icon: 'help', label: 'FAQ', link: '#' }
  ];
}