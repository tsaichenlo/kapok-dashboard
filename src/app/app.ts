import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PatientListComponent } from './components/patient-list/patient-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PatientListComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Kapok Dashboard');
}
