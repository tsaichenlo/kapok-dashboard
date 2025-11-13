import { Component, OnInit } from '@angular/core';
import { Patient } from '../../models/patient';
import { PatientService } from '../../services/patient.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.css'],
})
export class PatientListComponent implements OnInit {
  patients: Patient[] = [];

  constructor(private patientService: PatientService) { }

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(): void {
    this.patientService.getPatients().subscribe({
      next: patients => {
        this.patients = patients
      },
      error: err => {
        console.error('Error fetching patients:', err);
      }
    });
  }

  markRescued(id: string): void {
    this.patientService.updatePatient(id, { rescued: true })
      .subscribe(() => this.loadPatients());
  }

  undoRescued(id: string): void {
    this.patientService.updatePatient(id, { rescued: false })
      .subscribe(() => this.loadPatients());
  }
}
