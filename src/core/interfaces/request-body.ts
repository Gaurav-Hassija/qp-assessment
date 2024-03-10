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
