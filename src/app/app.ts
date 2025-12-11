import { Component, signal, computed, inject } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { Navbar } from './shared/components/navbar/navbar';
import { Footer } from './shared/components/footer/footer';
import { RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, RouterModule, Footer],
  standalone: true,
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App {
  currentUrl = signal<string>('');
  hideNavbar = computed(() => 
    this.currentUrl().startsWith('/admin') || 
    this.currentUrl().startsWith('/organization-dashboard')
  );
  hideFooter = computed(() => 
    this.currentUrl().startsWith('/admin') || 
    this.currentUrl().startsWith('/organization-dashboard')
  );

  private readonly router = inject(Router);

  constructor() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.currentUrl.set(event.urlAfterRedirects);
      });
  }
}
