import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { ParkingLotModel, ParkingLotRequest } from './parking-lot.model';

@Service()
export class ParkingLotService {

  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8080/ParkingLot';

  getAllParkingLots() {
    return this.http.get<ParkingLotModel[]>(this.baseUrl);
  }

  getParkingLotById(id: string) {
    return this.http.get<ParkingLotModel>(`${this.baseUrl}/${id}`);
  }

  addParkingLot(parking: ParkingLotRequest) {
    return this.http.post<ParkingLotModel>(this.baseUrl, parking);
  }

  updateParkingLot(parking: ParkingLotRequest, id: string) {
    return this.http.put<ParkingLotModel>(`${this.baseUrl}/${id}`, parking);
  }

  deleteParkingLot(id: string) {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
