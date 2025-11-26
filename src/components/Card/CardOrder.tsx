import productImg from "@/assets/images/product/minyak.png";

export default function CardOrder({
  isIncomingOrder,
}: {
  isIncomingOrder: boolean;
}) {
  return (
    <div className="flex flex-col gap-y-4 rounded-xl bg-white p-4 font-poppins">
      <div className="flex items-start justify-between border-b-2 border-b-[#F2F2F2] ">
        <div className="flex flex-col gap-y-0.5 pb-2">
          <h6 className="#A7A5A5 text-sm">Pembelian</h6>
          <h5 className="font-semibold text-sm">22 Okt 2025 13:04</h5>
        </div>
        {!isIncomingOrder && (
          <button className="text-sm mt-1 p-2 text-white bg-[#F05000] rounded-lg">
            Pesanan Diproses
          </button>
        )}
      </div>
      <div className="flex items-start gap-x-3">
        <img className="w-18" src={productImg} alt="" />
        <div className="flex flex-col gap-y-1">
          <h5 className="font-semibold text-base">
            Minyak Goreng Curah / Liter
          </h5>
          <h5 className="text-sm">Kartika Dewi Utami</h5>
          <p className="text-xs leading-normal overflow-hidden text-ellipsis [display:-webkit-box] [-webkit-line-clamp:3] [-webkit-box-orient:vertical]">
            {`Jl. Benda Atas No.34, RT.8/RW.4, Cilandak Tim., Ps. Minggu, Kota
            Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12560`.length > 60
              ? `Jl. Benda Atas No.34, RT.8/RW.4, Cilandak Tim., Ps. Minggu, Kota
            Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12560`.substring(
                  0,
                  60
                ) + "..."
              : `Jl. Benda Atas No.34, RT.8/RW.4, Cilandak Tim., Ps. Minggu, Kota
            Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12560`}
          </p>
        </div>
      </div>
      <div className="flex justify-between">
        <h6 className="text-black/60 font-medium text-sm">Total Harga</h6>
        <h5 className="font-semibold text-[15px]">Rp 9.250.000</h5>
      </div>
      {isIncomingOrder && (
        <div className="grid grid-cols-2 gap-3">
          <button className="bg-[#F00000] p-2 rounded-lg text-white cursor-pointer text-sm">
            Tolak Pesanan
          </button>
          <button className="bg-[#1EC500] p-2 rounded-lg text-white cursor-pointer text-sm">
            Terima
          </button>
        </div>
      )}
    </div>
  );
}
