import type { FormStore } from "@/interface/IFormStore";
import api from "./axios";

export const openStore = async (payload: FormStore) => {
  const {
    avatarLink,
    name,
    description,
    guide,
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
    avatar_link: avatarLink,
    name,
    guide,
    description,
    phone,
    address: {
      detail: detailAddress,
      lat: latLng?.lat,
      lon: latLng?.lng,
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

export const updateStore = async (payload: FormStore) => {
  const {
    avatarLink,
    name,
    guide,
    description,
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

  const { data } = await api.put("/store/update", {
    avatar_link: avatarLink,
    name,
    guide,
    description,
    phone,
    address: {
      detail: detailAddress,
      lat: latLng?.lat,
      lon: latLng?.lng,
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

export const openOrCloseStore = async (storeStatus: "closed" | "open") => {
  const { data } = await api.put("/store/update", {
    status: storeStatus,
  });

  return data.result;
};
