export interface AddressModel {
  id: string;
  street: string;
  number: number;
  zipCode: string;
  notes: string;
}

export interface AddressModelForForm {
  street: string;
  number: number;
  zipCode: string;
  notes: string;
}
