import { Component } from '@angular/core';
import { Hero } from './hero/hero';
import { whatWeDo } from './what-we-do/what-we-do';

import { State } from './state/state';
import { HowItWorks } from './how-it-works/how-it-works';
import { LatestBlog } from './latest-blog/latest-blog';
import { Testimonials } from './testimonials/testimonials';

@Component({
  selector: 'app-home',
  imports: [Hero, State, whatWeDo, HowItWorks, LatestBlog, Testimonials],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
