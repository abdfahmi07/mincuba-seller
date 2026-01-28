export interface Order {
  id: number;
  invoice: string;
  price: string;
  total_price: string;
  store_id: number;
  Store: Store;
  BuyerID: string;
  User: User;
  payment_id: string;
  Payment: Payment;
  data: Data2;
  type: string;
  status: string;
  status_message: unknown;
  OrderItems: OrderItem[];
  finish_at: unknown;
  created_at: string;
  updated_at: string;
  deleted_at: unknown;
}

export interface User {
  id: string;
  email: string;
  username: string;
  phone: string;
  status: string;
  verified_at: unknown;
  created_at: string;
  updated_at: string;
  deleted_at: unknown;
  Profile: Profile;
  Roles: unknown;
}

export interface Profile {
  ID: number;
  FirstName: string;
  LastName: string;
  Bio: unknown;
  Avatar: string;
  UserID: string;
  User: unknown;
  created_at: string;
  updated_at: string;
}

export interface Store {
  id: number;
  name: string;
  description: string;
  guide: string;
  phone: string;
  avatar_link: string;
  status: string;
  operational_hours: unknown;
  order_process_note: unknown;
  user_id: string;
  User: unknown;
  address_id: number;
  Address: Address;
  created_at: string;
  updated_at: string;
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

export interface Payment {
  id: string;
  UserID: string;
  User: unknown;
  price: string;
  fee_price: string;
  total_price: string;
  pg_response: PgResponse;
  status: string;
  status_message: unknown;
  Orders: unknown;
  expire_at: unknown;
  created_at: string;
  updated_at: string;
  deleted_at: unknown;
}

export interface PgResponse {
  app: string;
  data: Data;
  expire: string;
  channel: Channel;
  orderId: string;
  ChannelId: number;
  callbackUrl: string;
  grossAmount: string;
  totalAmount: number;
  transactionId: string;
  transactionStatus: string;
}

export interface Data {
  bank: string;
  vaNumber: string;
  paymentType: string;
}

export interface Channel {
  id: number;
  fee: number;
  logo: string;
  name: string;
  nameCode: string;
  platform: string;
  createdAt: string;
  deletedAt: unknown;
  updatedAt: string;
  howToUseUrl: unknown;
  paymentType: string;
  service_fee: unknown;
}

export interface Data2 {
  payment: Payment2;
  shipping: Shipping;
}

export interface Payment2 {
  app: string;
  data: Data3;
  expire: string;
  channel: Channel2;
  orderId: string;
  ChannelId: number;
  callbackUrl: string;
  grossAmount: string;
  totalAmount: number;
  transactionId: string;
  transactionStatus: string;
}

export interface Data3 {
  bank: string;
  vaNumber: string;
  paymentType: string;
}

export interface Channel2 {
  id: number;
  fee: number;
  logo: string;
  name: string;
  nameCode: string;
  platform: string;
  createdAt: string;
  deletedAt: unknown;
  updatedAt: string;
  howToUseUrl: unknown;
  paymentType: string;
  service_fee: unknown;
}

export interface Shipping {
  store_id: number;
  shipping_method: string;
}

export interface OrderItem {
  id: number;
  qty: number;
  price: string;
  total_price: string;
  product_id: number;
  Product: Product;
  order_id: number;
  Order: unknown;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  condition: string;
  unit: string;
  weight: string;
  min: number;
  stock: number;
  product_category_id: unknown;
  Category: unknown;
  store_id: number;
  Store: unknown;
  ProductImage: ProductImage[];
  active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: unknown;
}

export interface ProductImage {
  id: number;
  url: string;
  product_id: number;
  created_at: string;
  updated_at: string;
}
