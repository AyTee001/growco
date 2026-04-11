import { Component, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { inject } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [MatIconModule, RouterModule],
  templateUrl: './footer.html',
  styleUrl: './footer.scss'
})
export class Footer {
  currentYear = signal(new Date().getFullYear());
  private router = inject(Router);

  goToAbout(): void {
    this.router.navigate(['/about-us']).then(() => {
      window.scrollTo({ top: 0, behavior: 'auto' });
    });
  }
}