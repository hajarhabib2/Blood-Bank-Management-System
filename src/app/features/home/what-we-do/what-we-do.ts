import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-what-we-do',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './what-we-do.html',
  styleUrls: ['./what-we-do.css'],
})
export class whatWeDo {
  //union type
  activeTab: 'bloodDonation' | 'bloodBank' | 'healthCheck' = 'bloodDonation';

  //object
  bloodDonationContent = {
    title: 'Blood Donation: The Gift of Life',
    body: "In less than an hour, your simple act of donation provides a vital second chance for trauma patients, surgical recipients, and those in critical care. It's the most profound gift you can offer, giving you the deep satisfaction of strengthening your entire community's resilience.",
    points: [
      'Triple Impact: One donation can save up to three lives.',
      'Free Health Check: Receive a complimentary mini-screening.',
      'Boosted Renewal: Stimulates your body to produce fresh blood cells.',
      'Ready for Emergencies: Ensures life-saving stock is available for critical times.',
    ],
  };

  bloodBankContent = {
    title: 'State-of-the-Art Blood Bank Operations',
    body: 'We operate 24/7 to transform generous donations into life-saving products. Our facility uses advanced technology for rigorous testing, component separation, and secure cold storage, guaranteeing that safe, viable blood is instantly available when crisis strikes.',
    points: [
      'Rigorous Testing: Comprehensive screening for infectious diseases on every unit.',
      'Component Processing: Separating blood into red cells, plasma, and platelets for precise patient treatment.',
      'Rapid Distribution: 24/7 logistics ensuring immediate delivery to all hospitals.',
      'Certified Quality: Strict adherence to global blood banking safety standards.',
    ],
  };

  healthCheckContent = {
    title: 'Community Health & Wellness Checks',
    body: 'Beyond blood supply, we are committed to proactive community health. We offer convenient, essential health screenings and educational resources to identify potential issues early and promote a preventative approach to wellness for all our donors and neighbors.',
    points: [
      'Essential Screenings: Free checks for blood pressure, iron levels, and cholesterol.',
      'Early Detection: Identifying potential risks related to hypertension or anemia.',
      'Health Education: Access to resources and advice on nutrition and wellness.',
      'Confidential Results: Professional review and discreet delivery of your health data.',
    ],
  };

  //function
  setActiveTab(tab: 'bloodDonation' | 'bloodBank' | 'healthCheck'): void {
    //The active tab has changed — update the interface (UI)
    this.activeTab = tab;
  }
}
