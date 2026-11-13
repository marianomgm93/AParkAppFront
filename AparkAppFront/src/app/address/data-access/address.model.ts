export interface AddressModel {

id:string|number;
street:string;
number:number;
zipcode:string;
notes:string;


}

export type AddressModelForForm=Omit<AddressModel,'id'>