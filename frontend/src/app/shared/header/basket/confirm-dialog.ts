import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Очистити кошик?</h2>
    <mat-dialog-content>
      Ви впевнені, що хочете видалити всі товари з кошика? Цю дію неможливо скасувати.
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onNoClick()">Скасувати</button>
      <button mat-flat-button color="warn" [mat-dialog-close]="true">Видалити все</button>
    </mat-dialog-actions>
  `,
  styles: [`
    mat-dialog-actions { padding-bottom: 16px; padding-right: 16px; }
    button { border-radius: 8px; }
  `]
})
export class ConfirmDialog {
  constructor(public dialogRef: MatDialogRef<ConfirmDialog>) {}

  onNoClick(): void {
    this.dialogRef.close(false);
  }
}