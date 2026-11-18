import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NewVehicleDTO, VehicleDTO} from './vehicle-model'

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/vehicles';

  getAll(): Observable<VehicleDTO[]> {
    return this.http.get<VehicleDTO[]>(this.apiUrl);
  }

  getById(id: string): Observable<VehicleDTO> {
    return this.http.get<VehicleDTO>(`${this.apiUrl}/${id}`);
  }

  create(vehicle: NewVehicleDTO): Observable<VehicleDTO> {
    return this.http.post<VehicleDTO>(this.apiUrl, vehicle);
  }

  update(id: string, vehicle: NewVehicleDTO): Observable<VehicleDTO> {
    return this.http.put<VehicleDTO>(`${this.apiUrl}/${id}`, vehicle);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}