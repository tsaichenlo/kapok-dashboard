import { Injectable } from '@angular/core';
import { mockPatients } from '../data/mock-patients';
import { Observable, of } from 'rxjs';
import { Patient } from '../models/patient';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  private apiUrl = 'http://localhost:3000/patients';

  constructor(private http: HttpClient) { }

  getPatients(): Observable<Patient[]> {
    return this.http.get<Patient[]>(this.apiUrl);
  }

  getPatientById(id: string): Observable<Patient | undefined> {
    return this.http.get<Patient>(`${this.apiUrl}/${id}`);
  }

  updatePatient(id: string, data: any) {
    return this.http.patch(`${this.apiUrl}/${id}`, data);
  }
}
