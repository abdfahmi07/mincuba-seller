import productImg from "@/assets/images/product/minyak.png";
import { useRef } from "react";

export default function CreateProductPage() {
  const photoInput = useRef<HTMLInputElement>(null);

  const handleAddPhotoProduct = () => {
    if (photoInput.current) {
      photoInput.current.click();
    }
  };

  return (
    <div className="px-4 py-5 mb-24 font-poppins">
      <form className="flex flex-col gap-y-6">
        <div className="flex flex-col gap-y-3">
          <label htmlFor="" className="font-medium">
            Foto Produk
          </label>
          <div className="flex flex-wrap gap-x-1.5">
            <img className="w-15 h-15" src={productImg} alt="Foto Produk" />
            <img className="w-15 h-15" src={productImg} alt="Foto Produk" />
            <img className="w-15 h-15" src={productImg} alt="Foto Produk" />
            <div>
              <button
                className="rounded-md p-1 border border-dashed flex items-center justify-center flex-col gap-y-2 w-18 h-15 cursor-pointer"
                onClick={handleAddPhotoProduct}
              >
                <h6 className="text-xs font-semibold text-[#adadad]">
                  Tambah Foto
                </h6>
              </button>
              <input
                ref={photoInput}
                className="hidden"
                type="file"
                name=""
                id=""
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-y-4">
          <label htmlFor="" className="font-medium">
            Isi nama produk yang kamu jual
          </label>
          <div className="flex flex-col gap-y-2">
            <input
              className="outline-none border-b-2 border-black/10 py-2 placeholder:text-[#B4B4B4]"
              type="text"
              placeholder="Nama Produk"
            />
            <p className="text-xs text-[#868686]">
              Tips: Jenis Produk + Merek Produk + Keterangan Tambahan
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-y-4">
          <label htmlFor="" className="font-medium">
            Harga
          </label>
          <div className="flex flex-col gap-y-2">
            <div className="relative">
              <span className="absolute left-0 bottom-3 text-[#B4B4B4] font-semibold">
                Rp
              </span>
              <input
                className="outline-none border-b-2 border-black/10 py-2 placeholder:text-[#B4B4B4] px-6 w-full"
                type="text"
              />
            </div>
            <p className="text-xs text-[#868686]">
              Tentukan harga sesuai pasaran produkmu
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-y-4">
          <label htmlFor="" className="font-medium">
            Stok
          </label>
          <div className="flex flex-col gap-y-2">
            <input
              className="outline-none border-b-2 border-black/10 py-2 placeholder:text-[#B4B4B4]"
              type="text"
              placeholder="Stok Tersedia"
            />
            <input
              className="outline-none border-b-2 border-black/10 py-2 placeholder:text-[#B4B4B4]"
              type="text"
              placeholder="Pesanan Minimum"
            />
          </div>
        </div>
        <div className="flex flex-col gap-y-4">
          <label htmlFor="" className="font-medium">
            Tulis deskripsi produk kamu
          </label>
          <div className="flex flex-col gap-y-2">
            <input
              className="outline-none border-b-2 border-black/10 py-2 placeholder:text-[#B4B4B4]"
              type="text"
              placeholder="Deskripsi Produk"
            />
          </div>
        </div>
        <div className="flex flex-col gap-y-4 w-fit">
          <label htmlFor="" className="font-medium">
            Tentukan berat pengirimanmu
          </label>
          <div className="flex flex-col gap-y-2">
            <div className="relative">
              <input
                className="outline-none border-b-2 border-black/10 py-2 placeholder:text-[#B4B4B4]"
                type="text"
                placeholder="Berat"
              />
              <span className="absolute right-14 bottom-3 text-[#B4B4B4] font-semibold">
                Gram
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-y-4">
          <label htmlFor="" className="font-medium">
            Tulis Panduan Produk
          </label>
          <div className="flex flex-col gap-y-2">
            <input
              className="outline-none border-b-2 border-black/10 py-2 placeholder:text-[#B4B4B4]"
              type="text"
              placeholder="Deskripsi Produk"
            />
          </div>
        </div>
        <button className="w-full py-3 rounded-lg text-white font-semibold bg-[#F05000]">
          Tambah Produk
        </button>
      </form>
    </div>
  );
}
