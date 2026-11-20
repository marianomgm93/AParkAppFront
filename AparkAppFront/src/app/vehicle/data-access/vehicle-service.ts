import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable, of } from 'rxjs';
import { NewVehicleRequest, VehicleModel } from './vehicle-model';
import { UserClient } from '../../user/data-access/user-client';
import { User } from '../../user/data-access/user';

@Service()
export class VehicleService {
  private readonly http = inject(HttpClient);
  private readonly userClient = inject(UserClient);

  private readonly apiBase = 'http://localhost:8080';
  private readonly vehiclesUrl = `${this.apiBase}/vehicles`;
  private readonly reservationsUrl = `${this.apiBase}/reservation`;

  getAllVehicles(): Observable<VehicleModel[]> {
    return this.http.get<VehicleModel[]>(this.vehiclesUrl);
  }

  getVehiclesByUser(userId: string): Observable<VehicleModel[]> {
    return this.http.get<VehicleModel[]>(`${this.vehiclesUrl}/user/${userId}`);
  }

  getVehicleById(id: string): Observable<VehicleModel> {
    return this.http.get<VehicleModel>(`${this.vehiclesUrl}/${id}`);
  }

  createVehicle(request: NewVehicleRequest): Observable<VehicleModel> {
    return this.http.post<VehicleModel>(this.vehiclesUrl, {
      ...request,
      plate: request.plate.trim().toUpperCase(),
    });
  }

  updateVehicle(id: string, request: NewVehicleRequest): Observable<VehicleModel> {
    return this.http.put<VehicleModel>(`${this.vehiclesUrl}/${id}`, {
      ...request,
      plate: request.plate.trim().toUpperCase(),
    });
  }

  deleteVehicle(id: string): Observable<void> {
    return this.http.delete<void>(`${this.vehiclesUrl}/${id}`);
  }

  getReservationsByPlate(plate: string): Observable<unknown[]> {
    const params = new HttpParams().set('plate', plate.trim());
    return this.http.get<unknown[]>(`${this.reservationsUrl}/vehicle`, { params });
  }

  getUsersForAdmin(isAdmin: boolean): Observable<User[]> {
    if (!isAdmin) return of([]);
    return this.userClient.getAll();
  }
}