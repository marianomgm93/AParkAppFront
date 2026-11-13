import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { AddressModel, AddressModelForForm } from './address.model';

@Service()
export class AddressService {

    private readonly http=inject(HttpClient);
    private baseUrl="http://localhost:8080/api/address"


getAllAddresses()
{
    return this.http.get<AddressModel[]>(this.baseUrl);
}

getAddressById(id:string|number)
{
 return this.http.get<AddressModel>(`${this.baseUrl}/${id}`);
}

addAddress(address:AddressModelForForm)
{

   return this.http.post<AddressModel>(this.baseUrl,address);
}

updateAddress(address:AddressModelForForm,id:string|number)
{
    return this.http.patch<AddressModel>(`${this.baseUrl}/${id}`,address);
}

deleteAddress(id:number|string)
{
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
}

}
