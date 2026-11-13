import { AddressModelForForm } from "../../address/data-access/address.model";
import { UserFormModel } from "../../user/data-access/user";

export interface ParkingLotModel {

    id:string|number;
    name:string;
    active:boolean;
    capacity:number;
    user:UserFormModel;
    address:AddressModelForForm;

}

export type ParkingLotModelForForm=Omit<ParkingLotModel,'id'>
