import { Component, EventEmitter, Input, Output } from '@angular/core';

export type InfoRowActionType = 'plus' | 'pencil' | 'chevron';

@Component({
  selector: 'app-info-row',
  standalone: true,
  templateUrl: './info-row.html',
  styleUrl: './info-row.scss'
})
export class InfoRowComponent {
  @Input({ required: true }) label!: string;
  @Input() value = '';
  @Input({ required: true }) actionType!: InfoRowActionType;
  @Input() showDivider = true;
  @Input() emptyPlaceholder = 'Не вказано';

  @Output() activated = new EventEmitter<void>();

  get isEmpty(): boolean {
    return !this.value || !String(this.value).trim();
  }

  get displayValue(): string {
    return this.isEmpty ? this.emptyPlaceholder : String(this.value).trim();
  }

  get actionIcon(): string {
    switch (this.actionType) {
      case 'pencil':
        return 'edit';
      case 'chevron':
        return 'chevron_right';
      default:
        return 'add';
    }
  }

  onActivate(): void {
    this.activated.emit();
  }
}
