import type { CourierPayload } from "@/interface/ICourier";
import api from "./axios";

export const getAllCourier = async () => {
  const { data } = await api.get("/user/seller/get/couriers");

  return data.result;
};

export const createCourier = async (payload: CourierPayload) => {
  await api.post("/user/seller/create/courier", payload);
};

export const deleteCourier = async (courierId: string) => {
  await api.delete(`/user/seller/delete/courier/${courierId}`);
};
