import productImg from "@/assets/images/product/minyak.png";

export default function CardProduct() {
  return (
    <div className="flex justify-between items-start px-4 py-5 gap-x-3 font-poppins border-b-2 border-b-black/10">
      <div className="flex gap-x-3">
        <img className="rounded-xl w-20" src={productImg} alt="Product Image" />
        <div className="flex flex-col gap-y-1">
          <h5 className="text-sm font-semibold">Minyak Goreng Curah / Liter</h5>
          <h5 className="text-sm font-semibold text-[#D33E3E]">
            Rp9.000 / Liter
          </h5>
          <h6 className="text-xs text-[#6E6E6E]">
            Stock: <span className="font-semibold text-black">1.000.000</span>
          </h6>
        </div>
      </div>
      <button className="bg-[#F05000] rounded-lg text-sm px-6 py-2 text-white self-end cursor-pointer">
        Edit
      </button>
    </div>
  );
}
