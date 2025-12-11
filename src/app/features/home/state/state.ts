import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-state',
  imports: [CommonModule],
  templateUrl: './state.html',
  styleUrl: './state.css'
})
export class State {
  activeTab: 'why' | 'story' | 'questions' = 'why';
}
