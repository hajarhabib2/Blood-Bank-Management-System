import { Component } from '@angular/core';
import { Router, RouterModule, RouterLink } from '@angular/router';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [RouterModule, RouterLink],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero {}
