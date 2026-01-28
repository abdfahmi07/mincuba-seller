import api from "./axios";

export const getOrders = async (
  status: string = "",
  page: number = 1,
  limit: number = 10,
) => {
  const { data } = await api.get(`/order/seller/list`, {
    params: {
      limit,
      page,
      status,
    },
  });

  return data.result;
};

export const getOrderById = async (orderId: number) => {
  const { data } = await api.get(`/order/detail/${orderId}`);

  return data.result;
};

export const confirmOrder = async (orderId: number) => {
  await api.post(`/order/seller/confirmOrder/${orderId}`);
};

export const readyToPickupOrder = async (orderId: number) => {
  await api.post(`/order/seller/readyToPickupOrder/${orderId}`);
};

export const rejectOrder = async (
  orderId: number,
  payloads: { reason: string },
) => {
  await api.post(`/order/seller/cancelOrder/${orderId}`, payloads);
};
