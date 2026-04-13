import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-account-card',
  standalone: true,
  templateUrl: './account-card.html',
  styleUrl: './account-card.scss'
})
export class AccountCardComponent {
  @Input({ required: true }) title!: string;
}
