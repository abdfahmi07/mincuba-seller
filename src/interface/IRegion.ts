export interface Region {
  code: string;
  nama: string;
  parent_code: string;
  tingkat: string;
}

export interface PostalCode {
  province: string;
  city: string;
  district: string;
  sub_district: string;
  postal_code: string;
  code: string;
}
