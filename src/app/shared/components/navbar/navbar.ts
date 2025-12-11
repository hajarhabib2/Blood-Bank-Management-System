import { Component, ElementRef, signal, effect } from '@angular/core';
import { Router, RouterModule, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
})
export class Navbar {
  isMobileMenuOpen = signal(false);
  isRegisterDropdownOpen = signal(false);

  links = [
    { text: 'Home', route: '/' },
    { text: 'About', route: '/about' },
    { text: 'Latest Blog', route: '/latest-blog' },
    { text: 'Find Blood', route: '/find-blood' },
    {
      text: 'Register now',
      dropdown: true,
      subLinks: [
        { text: 'As Donor', route: 'register-donor' },
        { text: 'As Recipient', route: 'register-recipient' },
        { text: 'As Organization', route: 'register-org' },
      ],
    },
  ];
  constructor(private router: Router) {}

  getCurrentRoute(): string {
    return this.router.url;
  }

  toggleRegisterDropdown() {
    this.isRegisterDropdownOpen.update((v) => !v);
  }
  isRegisterDropdownOpenFn() {
    return this.isRegisterDropdownOpen();
  }
  toggleMenu() {
    this.isMobileMenuOpen.update((v) => !v);
  }
}
