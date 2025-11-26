import type { ProductPayload } from "@/interface/IProduct";
import api from "./axios";

const LIMIT = 10;

export const getAllProduct = async (page: number) => {
  const { data } = await api.get("/product/seller/get", {
    params: {
      page,
      limit: LIMIT,
    },
  });

  return data.result;
};

export const getProductById = async (productId: string) => {
  const { data } = await api.get(`/product/get/${productId}`);

  return data.result;
};

export const createProduct = async (payload: ProductPayload) => {
  await api.post("/product/seller/create", payload);
};

export const updateProduct = async (
  productId: string,
  payload: ProductPayload
) => {
  await api.put(`/product/seller/update/${productId}`, payload);
};

export const deleteProduct = async (productId: string) => {
  await api.delete(`/product/seller/delete/${productId}`);
};
