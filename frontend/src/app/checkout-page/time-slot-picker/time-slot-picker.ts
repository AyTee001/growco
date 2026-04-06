import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TimeSlot {
  id: number;
  time: string;
}

@Component({
  selector: 'app-time-slot-picker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './time-slot-picker.html',
  styleUrls: ['./time-slot-picker.scss']
})
export class TimeSlotPickerComponent {
  @Input() slots: TimeSlot[] = [];
  @Output() slotSelected = new EventEmitter<TimeSlot>();

  @Input() selectedSlot: TimeSlot | null = null;

  selectSlot(slot: TimeSlot) {
    this.slotSelected.emit(slot);
  }
}