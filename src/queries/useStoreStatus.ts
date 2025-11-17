import type {
  StoreFound,
  StoreNotFound,
  StoreStatus,
} from "@/interface/IStoreStatus";
import axios from "axios";
import api, { getAccessToken } from "@/services/api/axios";
import { useQuery } from "@tanstack/react-query";

export function useStoreStatus() {
  return useQuery({
    queryKey: ["storeStatus"],
    queryFn: async (): Promise<StoreStatus> => {
      try {
        const token = getAccessToken();
        const { data } = await api.get<StoreFound | StoreNotFound>(
          `/store/get/byUser`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if ((data as StoreNotFound).status === 404) {
          return { exists: false, isOpen: false, updatedAt: null };
        }

        const ok = data as StoreFound;
        return {
          exists: true,
          isOpen: !!ok.result.status,
          updatedAt: ok.result.updated_at ?? null,
        };
      } catch (err: unknown) {
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          return {
            exists: false,
            isOpen: false,
            updatedAt: null,
          } as StoreStatus;
        }
        throw err;
      }
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}
