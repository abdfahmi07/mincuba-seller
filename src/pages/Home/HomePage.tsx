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
import StoreClosed from "@/components/StoreClosed/StoreClosed";

export default function HomePage() {
  const [isOpenStore, setIsOpenStore] = useState<boolean>(false);
  const { data } = useStoreStatus();
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

  return (
    <div className="relative bg-white min-h-[90vh] rounded-t-4xl font-poppins px-6 py-12">
      {data?.exists ? (
        <>
          <div className="absolute -top-6 left-0 right-0 flex justify-center">
            {/* Switch Container */}
            <div className="relative flex bg-white rounded-full shadow-md p-1 font-semibold text-sm overflow-hidden">
              {/* background slider */}
              <span
                className={`absolute top-1 left-1 h-[calc(100%-0.5rem)] w-[calc(50%-0.25rem)] bg-[#F05000] rounded-full transition-transform duration-300 ease-in-out ${
                  isOpenStore ? "translate-x-0" : "translate-x-[calc(100%)]"
                }`}
              />

              {/* Buka Toko */}
              <button
                onClick={() => setIsOpenStore(true)}
                className={`relative z-10 px-6 py-2 rounded-full transition-colors duration-300 cursor-pointer ${
                  isOpenStore ? "text-white" : "text-[#F05000]"
                }`}
              >
                Buka Toko
              </button>

              {/* Tutup Toko */}
              <button
                onClick={() => setIsOpenStore(false)}
                className={`relative z-10 px-6 py-2 rounded-full transition-colors duration-300 cursor-pointer ${
                  !isOpenStore ? "text-white" : "text-[#F05000]"
                }`}
              >
                Tutup Toko
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {stats.map((stat, idx) => (
              <CardStats key={idx} stats={stat} />
            ))}
          </div>
          <div className="flex flex-col gap-y-3 mt-7">
            <h5 className="font-semibold text-black">Status Ekspedisi</h5>
            <div className="grid grid-cols-1 gap-3">
              {couriers.map((courier, idx) => (
                <CardCourier key={idx} courier={courier} />
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="py-5">
          <StoreClosed />
        </div>
      )}
    </div>
  );
}
