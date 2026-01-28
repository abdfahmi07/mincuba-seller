import { useCallback, useEffect, useRef, useState } from "react";
import CardOrder from "@/components/Card/CardOrder";
import { useStoreStatus } from "@/queries/useStoreStatus";
import NotFound from "@/components/NotFound/NotFound";
import Tabs from "@/components/Tabs/Tabs";
import type { Order } from "@/interface/IOrder";
import { isAxiosError } from "axios";
import { toast, ToastContainer } from "react-toastify";
import {
  confirmOrder,
  getOrders,
  readyToPickupOrder,
  rejectOrder,
} from "@/services/api/order";
import Spinner from "@/components/LoadingSpinner/Spinner";
import closedStore from "@/assets/images/icon/store-closed.png";

export default function OrdersPage() {
  const { data: dataStore, isLoading: isLoadingStoreStatus } = useStoreStatus();

  const [orders, setOrders] = useState<Order[]>([]);
  const [status, setStatus] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loadingRef = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const loadPage = useCallback(
    async (pageToLoad: number) => {
      if (loadingRef.current || !hasMore) return;

      loadingRef.current = true;
      setIsLoading(true);

      try {
        const statusParam = status === "" ? undefined : status;

        const res = await getOrders(statusParam, pageToLoad);

        setOrders((prev) =>
          pageToLoad === 1 ? (res.data ?? []) : [...prev, ...(res.data ?? [])],
        );

        if (res.pagination.current_page >= res.pagination.pages) {
          setHasMore(false);
        }
      } catch (err) {
        if (isAxiosError(err)) {
          toast.error(
            err.response?.data?.result?.error ?? "Terjadi kesalahan",
            { position: "top-center" },
          );
        } else {
          toast.error("Terjadi kesalahan tak terduga", {
            position: "top-center",
          });
        }
      } finally {
        loadingRef.current = false;
        setIsLoading(false);
      }
    },
    [status, hasMore],
  );

  useEffect(() => {
    if (dataStore?.exists) {
      loadPage(page);
    }
  }, [page, loadPage, dataStore]);

  useEffect(() => {
    if (!hasMore) return;

    observerRef.current?.disconnect();

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        console.log("OBSERVED", entry.isIntersecting);

        if (!entry.isIntersecting) return;
        if (loadingRef.current) return;

        setPage((prev) => prev + 1);
      },
      {
        root: null,
        rootMargin: "300px",
      },
    );

    const sentinel = sentinelRef.current;
    if (sentinel) observerRef.current.observe(sentinel);

    return () => observerRef.current?.disconnect();
  }, [hasMore, status]);

  useEffect(() => {
    if (page !== 1) return;
    if (!hasMore) return;
    if (loadingRef.current) return;

    requestAnimationFrame(() => {
      const sentinel = sentinelRef.current;
      if (!sentinel) return;

      const rect = sentinel.getBoundingClientRect();

      if (rect.top <= window.innerHeight) {
        console.log("AUTO LOAD PAGE 2");
        setPage(2);
      }
    });
  }, [orders, page, hasMore]);

  useEffect(() => {
    observerRef.current?.disconnect();
    loadingRef.current = false;

    setOrders([]);
    setPage(1);
    setHasMore(true);
  }, [status]);

  const reloadFirstPage = () => {
    observerRef.current?.disconnect();
    loadingRef.current = false;

    setOrders([]);
    setPage(1);
    setHasMore(true);
  };

  const handleConfirmOrder = async (orderId: number) => {
    try {
      await confirmOrder(orderId);
      reloadFirstPage();
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        toast.error(err.response?.data?.result?.error ?? "Terjadi kesalahan", {
          position: "top-center",
        });
        return;
      }
      toast.error("Terjadi kesalahan tak terduga", { position: "top-center" });
    }
  };

  const handleReadyToPickupOrder = async (orderId: number) => {
    try {
      await readyToPickupOrder(orderId);
      reloadFirstPage();
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        toast.error(err.response?.data?.result?.error ?? "Terjadi kesalahan", {
          position: "top-center",
        });
        return;
      }
      toast.error("Terjadi kesalahan tak terduga", { position: "top-center" });
    }
  };

  const handleRejectOrder = async (orderId: number, reason: string) => {
    try {
      await rejectOrder(orderId, { reason });
      reloadFirstPage();
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        toast.error(err.response?.data?.result?.error ?? "Terjadi kesalahan", {
          position: "top-center",
        });
        return;
      }
      toast.error("Terjadi kesalahan tak terduga", { position: "top-center" });
    }
  };

  const isFirstPageLoading = isLoading && page === 1 && orders.length === 0;

  return (
    <>
      {isLoadingStoreStatus && (
        <div className="mt-24 flex justify-center">
          <Spinner />
        </div>
      )}

      {!isLoadingStoreStatus && dataStore && dataStore?.exists ? (
        <>
          <Tabs handleChangeStatus={setStatus} status={status} />
          <div className="grid grid-cols-1 gap-3 p-4">
            {isFirstPageLoading && (
              <div className="mt-28 flex justify-center">
                <Spinner />
              </div>
            )}

            {!isLoading && orders.length === 0 && (
              <h5 className="text-base mx-auto my-40 font-poppins">
                Belum ada pesanan.
              </h5>
            )}

            {orders.map((order) => (
              <CardOrder
                key={order.id}
                order={order}
                handleConfirmOrder={handleConfirmOrder}
                handleReadyToPickupOrder={handleReadyToPickupOrder}
                handleRejectOrder={handleRejectOrder}
              />
            ))}

            {isLoading && orders.length > 0 && (
              <div className="flex justify-center py-4">
                <Spinner />
              </div>
            )}

            {/* SENTINEL */}
            <div ref={sentinelRef} className="h-10" />
          </div>
        </>
      ) : (
        <div className="pt-24 px-4">
          <NotFound
            icon={closedStore}
            message="Anda belum membuka toko. Silakan buka toko terlebih dahulu untuk melanjutkan aktivitas ini."
            urlNavigate="/store/create"
            titleBtn="Buka Toko"
          />
        </div>
      )}

      <ToastContainer hideProgressBar />
    </>
  );
}
