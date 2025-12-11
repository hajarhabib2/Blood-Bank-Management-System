import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.html',
  styleUrls: ['./about.css'],
})
export class About implements OnInit, OnDestroy {
  currentSlide = 0;
  slides = [
    {
      title: 'About BloodLink',
      content:
        'BloodLink connects donors with patients and organizations in need of blood, making donation easier and faster to save lives.',
      icon: '❤️',
    },
    {
      title: 'Our Vision',
      content:
        'To build a community where no one dies due to lack of blood. We make blood donation simple, reliable, and accessible for everyone.',
      icon: '👁️',
    },
    {
      title: 'Our Mission',
      content:
        'Encourage voluntary blood donation, provide real-time donor access, support hospitals efficiently, and raise awareness about regular blood donation.',
      icon: '🎯',
    },
    {
      title: 'Our Impact',
      content:
        'Since our inception, we have facilitated thousands of successful blood donations, connecting donors with those in need across the region.',
      icon: '🌟',
    },
  ];
  // Interval ID, initialized later (!)
  autoSlideInterval!: any;
  isPaused = false;

  stats = [
    { number: '10,000+', label: 'Lives Saved', icon: '❤️' },
    { number: '5,000+', label: 'Active Donors', icon: '👥' },
    { number: '200+', label: 'Partner Organizations', icon: '🏥' },
    { number: '50+', label: 'Blood Drives', icon: '🚑' },
  ];

  values = [
    {
      title: 'Compassion',
      description: 'We care deeply about every life we touch and every donor who gives selflessly.',
      icon: '💝',
    },
    {
      title: 'Reliability',
      description: "We ensure that blood is available when and where it's needed most.",
      icon: '🔒',
    },
    {
      title: 'Innovation',
      description: 'We use cutting-edge technology to streamline the donation process.',
      icon: '💡',
    },
    {
      title: 'Community',
      description:
        'We build strong connections between donors, recipients, and healthcare providers.',
      icon: '🤝',
    },
  ];

  ngOnInit() {
    this.startAutoSlide();
  }

  ngOnDestroy() {
    this.stopAutoSlide();
  }

  startAutoSlide() {
    this.autoSlideInterval = setInterval(() => {
      if (!this.isPaused) {
        this.nextSlide();
      }
    }, 5000);
  }

  stopAutoSlide() {
    clearInterval(this.autoSlideInterval);
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }

  goToSlide(index: number) {
    this.currentSlide = index;
  }

  pause() {
    this.isPaused = true;
  }

  resume() {
    this.isPaused = false;
  }
}
