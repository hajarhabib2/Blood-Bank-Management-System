import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportComponent } from './report';

@Component({
  selector: 'app-report-modal-legacy',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './report.html',
  styleUrls: ['./report-modal.css']
})
export class ReportModalLegacyComponent extends ReportComponent {}

