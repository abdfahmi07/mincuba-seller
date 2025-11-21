import type { Option } from "./ISelectOption";

export interface FormStore {
  avatarLink: string;
  name: string;
  phone: string;
  province: Option | null;
  city: Option | null;
  district: Option | null;
  subDistrict: Option | null;
  postalCode: string;
  detailAddress: string;
  guide: string;
  description: string;
  latLng?: LatLng;
  code?: string;
}

export interface LatLng {
  lat: number;
  lng: number;
}
