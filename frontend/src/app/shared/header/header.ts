import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MainMenu } from '../main-menu/main-menu';

@Component({
  selector: 'app-header',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatDialogModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private dialog = inject(MatDialog);

  openMenu() {
    this.dialog.open(MainMenu, {
      width: '100vw',
      maxWidth: '100vw',
      height: '75vh',
      position: {
        top: '0',
        left: '0'
      },
      panelClass: 'main-menu-75',
      enterAnimationDuration: '250ms',
      exitAnimationDuration: '200ms'
    });
  }
}
