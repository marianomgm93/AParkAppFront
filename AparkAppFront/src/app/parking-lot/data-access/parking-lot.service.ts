import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { ParkingLotModel, ParkingLotModelForForm } from './parking-lot.model';

@Service()
export class ParkingLotService {


    private readonly http=inject(HttpClient);
    private baseUrl="http://localhost:8080/api/ParkingLots"


getAllParkingLots()
{
    return this.http.get<ParkingLotModel[]>(this.baseUrl);
}

getParkingLotById(id:string|number)
{
 return this.http.get<ParkingLotModel>(`${this.baseUrl}/${id}`);
}

addParkingLot(parking:ParkingLotModelForForm)
{

   return this.http.post<ParkingLotModel>(this.baseUrl,parking);
}

updateParkingLot(parking:ParkingLotModelForForm,id:string|number)
{
    return this.http.patch<ParkingLotModel>(`${this.baseUrl}/${id}`,parking);
}

deleteParkingLot(id:number|string)
{
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
}



}
