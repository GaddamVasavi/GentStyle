export interface CreateAddressInput {
  fullName: string;
  phone: string;
  streetAddress1: string;
  streetAddress2?: string;
  city: string;
  state: string;
  postalCode: string;
  country?: string;
  isDefaultShipping?: boolean;
  isDefaultBilling?: boolean;
}

export interface UpdateAddressInput extends Partial<CreateAddressInput> {}
