import type { FormStore } from "@/interface/IFormStore";
import api from "./axios";

export const openStore = async (payload: FormStore) => {
  const {
    name,
    description: guide,
    phone,
    detailAddress,
    latLng,
    province,
    city,
    district,
    subDistrict: sub_district,
    postalCode: postal_code,
    code,
  } = payload;

  const { data } = await api.post("/store/create", {
    name,
    guide,
    phone,
    address: {
      detail: detailAddress,
      lat: latLng?.lat,
      lng: latLng?.lng,
      province: province?.label,
      city: city?.label,
      district: district?.label,
      sub_district: sub_district?.label,
      postal_code,
      code,
    },
  });

  return data;
};

export const getMyStore = async () => {
  const { data } = await api.get("/store/get/byUser");

  return data.result;
};
