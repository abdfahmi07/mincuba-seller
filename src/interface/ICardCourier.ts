export interface CardCourier {
  courier: Courier;
}

export interface Courier {
  name: string;
  status: "delivery" | "shipping" | "finish";
  time: string;
}
