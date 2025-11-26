import type { CardCourier } from "@/interface/ICardCourier";

export default function CardCourier({ courier }: CardCourier) {
  return (
    <div className="border border-[#E9E9E9] bg-[#FBFBFB] rounded-2xl p-4 grid grid-cols-[1fr_minmax(110px,140px)_auto] items-center gap-2.5">
      <h5 className="text-base font-semibold">{courier.name}</h5>

      <div
        className={`${
          courier.status === "delivery"
            ? "bg-[#008CEB]"
            : courier.status === "shipping"
            ? "bg-[#03ce03]"
            : "bg-[#F05000]"
        } text-center py-1 text-xs text-white rounded-2xl w-full`}
      >
        {courier.status === "delivery"
          ? "Siap Diantar"
          : courier.status === "shipping"
          ? "Perjalanan Antar"
          : "Telah Selesai"}
      </div>

      <p className="text-[10px] text-[#9F9F9F] text-right">{courier.time}</p>
    </div>
  );
}
