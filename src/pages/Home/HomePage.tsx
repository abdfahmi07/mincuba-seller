import { useState } from "react";
import type { Courier } from "@/interface/ICardCourier";
import type { Stats } from "@/interface/ICardStats";
import order from "@/assets/images/icon/order.png";
import product from "@/assets/images/icon/product.png";
import cash from "@/assets/images/icon/cash.png";
import list from "@/assets/images/icon/list.png";
import CardStats from "@/components/Card/CardStats";
import CardCourier from "@/components/Card/CardCourier";
import { useStoreStatus } from "@/queries/useStoreStatus";
import closedStore from "@/assets/images/icon/not-found-icon.png";
import NotFound from "@/components/NotFound/NotFound";
import { openOrCloseStore } from "@/services/api/store";
import Spinner from "@/components/LoadingSpinner/Spinner";

export default function HomePage() {
  const {
    data: dataStore,
    refetch,
    isLoading: isLoadingStoreStatus,
  } = useStoreStatus();
  const [isLoadingUpdateStatusStore, setIsLoadingUpdateStatusStore] =
    useState<boolean>(false);
  const [stats] = useState<Stats[]>([
    {
      icon: order,
      amount: "14",
      category: "Pesanan Masuk",
      timeLabel: "Hari ini",
    },
    {
      icon: product,
      amount: "595",
      category: "Produk Terjual",
      timeLabel: "30 Hari Terakhir",
    },
    {
      icon: cash,
      amount: "150",
      category: "Pemasukan Bulan Ini",
      timeLabel: "30 Hari Terakhir",
    },
    {
      icon: list,
      amount: "1229",
      category: "Rating & Ulasan",
      timeLabel: "30 Hari Terakhir",
    },
  ]);

  const [couriers] = useState<Courier[]>([
    {
      name: "Ali Marjuki",
      status: "delivery",
      time: "2 Menit Lalu",
    },
    {
      name: "Jul Kifli",
      status: "shipping",
      time: "2 Menit Lalu",
    },
    {
      name: "Chaerudin",
      status: "shipping",
      time: "2 Menit Lalu",
    },
    {
      name: "Chaerudin",
      status: "finish",
      time: "2 Menit Lalu",
    },
    {
      name: "Jul Kifli",
      status: "delivery",
      time: "2 Menit Lalu",
    },
  ]);

  const handleUpdateStatusStore = async (statusStore: "closed" | "open") => {
    setIsLoadingUpdateStatusStore(true);
    await new Promise((res) => setTimeout(res, 1000));
    await openOrCloseStore(statusStore);
    await refetch();
    setIsLoadingUpdateStatusStore(false);
  };

  return (
    <>
      <div className="relative bg-white min-h-[90vh] rounded-t-4xl font-poppins px-6 py-12">
        {isLoadingStoreStatus && (
          <div className="mt-24 flex justify-center">
            <Spinner />
          </div>
        )}
        {!isLoadingStoreStatus && dataStore && dataStore?.exists && (
          <>
            <div className="absolute -top-6 left-0 right-0 flex justify-center">
              {/* Switch Container */}
              <div className="relative grid grid-cols-2 bg-white rounded-full shadow-md p-1 font-semibold text-sm overflow-hidden min-h-12 min-w-[16rem]">
                {/* background slider */}
                <span
                  className={`absolute top-1 left-1 h-[calc(100%-0.5rem)] w-[calc(50%-0.25rem)] bg-[#F05000] rounded-full transition-transform duration-300 ease-in-out ${
                    dataStore.data?.status === "open"
                      ? "translate-x-0"
                      : "translate-x-[calc(100%)]"
                  }`}
                />

                {/* Buka Toko */}
                <button
                  onClick={() => handleUpdateStatusStore("open")}
                  className={`relative z-10 px-6 py-2 rounded-full transition-colors duration-300 cursor-pointer ${
                    dataStore.data?.status === "open"
                      ? "text-white"
                      : "text-[#F05000]"
                  }`}
                  disabled={
                    isLoadingUpdateStatusStore &&
                    dataStore.data?.status === "open"
                  }
                >
                  {isLoadingUpdateStatusStore &&
                  dataStore.data?.status === "closed" ? (
                    <div className="flex justify-center items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 200 200"
                        className="w-6 h-6"
                      >
                        <radialGradient
                          id="a12"
                          cx=".66"
                          fx=".66"
                          cy=".3125"
                          fy=".3125"
                          gradientTransform="scale(1.5)"
                        >
                          <stop offset="0" stop-color="#F05000"></stop>
                          <stop
                            offset=".3"
                            stop-color="#F05000"
                            stop-opacity=".9"
                          ></stop>
                          <stop
                            offset=".6"
                            stop-color="#F05000"
                            stop-opacity=".6"
                          ></stop>
                          <stop
                            offset=".8"
                            stop-color="#F05000"
                            stop-opacity=".3"
                          ></stop>
                          <stop
                            offset="1"
                            stop-color="#F05000"
                            stop-opacity="0"
                          ></stop>
                        </radialGradient>
                        <circle
                          transform-origin="center"
                          fill="none"
                          stroke="url(#a12)"
                          stroke-width="13"
                          stroke-linecap="round"
                          stroke-dasharray="200 1000"
                          stroke-dashoffset="0"
                          cx="100"
                          cy="100"
                          r="70"
                        >
                          <animateTransform
                            type="rotate"
                            attributeName="transform"
                            calcMode="spline"
                            dur="1"
                            values="360;0"
                            keyTimes="0;1"
                            keySplines="0 0 1 1"
                            repeatCount="indefinite"
                          ></animateTransform>
                        </circle>
                        <circle
                          transform-origin="center"
                          fill="none"
                          opacity=".2"
                          stroke="#F05000"
                          stroke-width="13"
                          stroke-linecap="round"
                          cx="100"
                          cy="100"
                          r="70"
                        ></circle>
                      </svg>
                    </div>
                  ) : (
                    "  Buka Toko"
                  )}
                </button>

                {/* Tutup Toko */}
                <button
                  onClick={() => handleUpdateStatusStore("closed")}
                  className={`relative z-10 px-6 py-2 rounded-full transition-colors duration-300 cursor-pointer ${
                    dataStore.data?.status === "closed"
                      ? "text-white"
                      : "text-[#F05000]"
                  }`}
                  disabled={
                    isLoadingUpdateStatusStore &&
                    dataStore.data?.status === "closed"
                  }
                >
                  {isLoadingUpdateStatusStore &&
                  dataStore.data?.status === "open" ? (
                    <div className="flex justify-center items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 200 200"
                        className="w-6 h-6"
                      >
                        <radialGradient
                          id="a12"
                          cx=".66"
                          fx=".66"
                          cy=".3125"
                          fy=".3125"
                          gradientTransform="scale(1.5)"
                        >
                          <stop offset="0" stop-color="#F05000"></stop>
                          <stop
                            offset=".3"
                            stop-color="#F05000"
                            stop-opacity=".9"
                          ></stop>
                          <stop
                            offset=".6"
                            stop-color="#F05000"
                            stop-opacity=".6"
                          ></stop>
                          <stop
                            offset=".8"
                            stop-color="#F05000"
                            stop-opacity=".3"
                          ></stop>
                          <stop
                            offset="1"
                            stop-color="#F05000"
                            stop-opacity="0"
                          ></stop>
                        </radialGradient>
                        <circle
                          transform-origin="center"
                          fill="none"
                          stroke="url(#a12)"
                          stroke-width="13"
                          stroke-linecap="round"
                          stroke-dasharray="200 1000"
                          stroke-dashoffset="0"
                          cx="100"
                          cy="100"
                          r="70"
                        >
                          <animateTransform
                            type="rotate"
                            attributeName="transform"
                            calcMode="spline"
                            dur="1"
                            values="360;0"
                            keyTimes="0;1"
                            keySplines="0 0 1 1"
                            repeatCount="indefinite"
                          ></animateTransform>
                        </circle>
                        <circle
                          transform-origin="center"
                          fill="none"
                          opacity=".2"
                          stroke="#F05000"
                          stroke-width="13"
                          stroke-linecap="round"
                          cx="100"
                          cy="100"
                          r="70"
                        ></circle>
                      </svg>
                    </div>
                  ) : (
                    "Tutup Toko"
                  )}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {stats.map((stat, idx) => (
                <CardStats key={idx} stats={stat} />
              ))}
            </div>
            <div className="flex flex-col gap-y-3 mt-7 mb-10">
              <h5 className="font-semibold text-black">Status Ekspedisi</h5>
              <div className="grid grid-cols-1 gap-3">
                {couriers.map((courier, idx) => (
                  <CardCourier key={idx} courier={courier} />
                ))}
              </div>
            </div>
          </>
        )}
        {dataStore && !dataStore?.exists && (
          <div className="py-2">
            <NotFound
              icon={closedStore}
              message="Anda belum membuka toko. Silakan buka toko terlebih dahulu untuk
          melanjutkan aktivitas ini."
              urlNavigate="/store/create"
              titleBtn="Buka Toko"
            />
          </div>
        )}
      </div>
    </>
  );
}
