import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [FormsModule, RouterModule, RouterLink],
  templateUrl: './footer.html',
  styleUrls: ['./footer.css'],
})
export class Footer {
  newsletterEmail: string = '';

  subscribe() {
    console.log(`Subscribing with email: ${this.newsletterEmail}`);
  }
}
