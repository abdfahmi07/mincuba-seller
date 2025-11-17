export interface StoreFound {
  message: string;
  status: 200;
  result: Result;
}

export interface Result {
  id: number;
  name: string;
  guide: string;
  phone: string;
  status: string;
  user_id: string;
  User: User;
  address_id: number;
  Address: Address;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  phone: string;
  status: string;
  verified_at: string;
  created_at: string;
  updated_at: string;
  deleted_at: unknown;
  Profile: unknown;
  Roles: unknown;
}

export interface Address {
  id: number;
  detail: string;
  location: Location;
  province: string;
  city: string;
  district: string;
  sub_district: string;
  postal_code: string;
  code: string;
  created_at: string;
  updated_at: string;
}

export interface Location {
  latitude: number;
  longitude: number;
}

export interface StoreNotFound {
  message: string;
  status: 404;
  result: null;
}

export interface StoreStatus {
  exists: boolean;
  isOpen: boolean;
  updatedAt: string | null;
}
