// Espeja el AddressResponse del back (campo zipCode con C mayúscula)
export interface AddressModel {
  id: string;
  street: string;
  number: number;
  zipCode: string;   // ← el back usa zipCode (C mayúscula)
  notes: string;
}

// Lo que se manda al back (AddressRequest)
export interface AddressModelForForm {
  street: string;
  number: number;
  zipCode: string;   // ← igual, con C mayúscula
  notes: string;
}