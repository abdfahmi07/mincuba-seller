import type { MyStore } from "./IMyStore";

export interface StoreFound {
  message: string;
  status: 200;
  result: MyStore;
}

export interface StoreNotFound {
  message: string;
  status: 404;
  result: null;
}

export interface StoreStatus {
  data: MyStore | null;
  exists: boolean;
  isOpen: boolean;
  updatedAt: string | null;
}
