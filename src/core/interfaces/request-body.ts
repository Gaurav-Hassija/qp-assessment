export interface ISendOtp {
  phone_number: string;
}

export interface IVerifyOtp {
  phone_number: string;
  otp: string;
}

export interface ICreateCategory {
  name: string;
  description: string;
}

export interface IAddItem {
  category: number;
  name: string;
  description: string;
  price: number;
  unit: string;
  stock_available: number;
}

export interface IDeleteItem {
  item_id: number;
}

export interface IUpdateItem {
  id: number;
  name: string;
  description: string;
  price: number;
  available_stock: number;
}

export interface ICreateOrder {
  items: Items[];
  billing_address: IAddress;
  shipping_address: IAddress;
}

export interface Items {
  item_id: number;
  quantity: number;
}

export interface IAddress {
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  pincode: string;
}
