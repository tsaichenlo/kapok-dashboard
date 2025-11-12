import { Injectable } from '@angular/core';
import { mockPatients } from '../data/mock-patients';
import { Observable, of } from 'rxjs';
import { Patient } from '../models/patient';

@Injectable({
  providedIn: 'root',
})
export class PatientService {

  getPatients(): Observable<Patient[]> {
    return of(mockPatients);
  }

  getPatientById(id: string): Observable<Patient | undefined> {
    const patient = mockPatients.find(p => p.id == id);
    return of(patient);
  }
}
