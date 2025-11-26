import { formatIDNDecimal, toIDNCurrency } from "@/helpers/number";
import type { Product } from "@/interface/IProduct";
import imageBroken from "@/assets/images/icon/image-broke.png";
import { NavLink } from "react-router-dom";
import SwitchButton from "../SwitchButton/SwitchButton";
import { Pencil, Trash2 } from "lucide-react";

export default function CardProduct({
  product,
  removeProduct,
  hideProduct,
}: {
  product: Product;
  removeProduct: (productId: string, productName: string) => Promise<void>;
  hideProduct: (productId: string, isActive: boolean) => Promise<void>;
}) {
  return (
    <div className="flex flex-col gap-y-5 border-b-2 bg-white border-b-black/10 font-poppins px-4 py-5 rounded-xl">
      {product.stock <= product.min && (
        <div className="border-amber-300 border bg-amber-100 p-2 rounded-md w-full">
          <h6 className="text-xs">
            {product.unit === "grams"
              ? "Stok sudah habis, harap update stok anda"
              : "Stok sudah menipis, harap update stok anda"}
          </h6>
        </div>
      )}
      <div className="flex justify-between items-start gap-x-2 ">
        <div className="flex flex-col gap-y-2">
          <div className="flex gap-x-3">
            <img
              className="rounded-lg w-18 h-18 object-cover"
              src={
                product.ProductImage.length !== 0
                  ? product.ProductImage[0].url
                  : imageBroken
              }
              alt="Product Image"
            />
            <div className="flex flex-col gap-y-1">
              <h5 className="text-base font-semibold">{product.name}</h5>
              <div className="flex flex-col">
                <h5 className="text-[13px] font-semibold text-[#D33E3E] tracking-tight">
                  {`${
                    product.unit === "liter"
                      ? toIDNCurrency(product.price) + "/" + product.unit
                      : toIDNCurrency(product.price)
                  }`}
                </h5>
                <h6 className="text-[13px] text-[#6E6E6E]">
                  Stok :{" "}
                  {product.unit === "grams" && product.stock === 0 ? (
                    <span className="font-semibold text-black">Habis</span>
                  ) : (
                    <span className="font-semibold text-black">
                      {formatIDNDecimal(product.stock)}{" "}
                      {product.unit === "liter" ? product.unit : "barang"}
                    </span>
                  )}
                </h6>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-x-1.5 self-center">
          <NavLink to={`/products/edit/${product.id}`}>
            <button className="flex items-center gap-x-2 bg-[#F05000]/20 rounded-full text-sm p-2.5 text-white cursor-pointer">
              <Pencil color="#F05000" size={17} />
            </button>
          </NavLink>
          <button
            className="flex items-center gap-x-2 bg-red-200 rounded-full text-sm p-2.5 text-white cursor-pointer"
            onClick={() => removeProduct(product.id.toString(), product.name)}
          >
            <Trash2 color="#fb2c36" size={17} />
          </button>
        </div>
      </div>

      <div className="flex justify-between">
        <div className="flex flex-col gap-y-1">
          <h6 className="font-medium">Aktifkan Produk</h6>
          <p className="text-xs text-black/50">
            Produk aktif akan muncul di halaman produk dan bisa dipesan oleh
            pelanggan
          </p>
        </div>
        <div className="flex items-center gap-4 self-start">
          <SwitchButton
            checked={product.active}
            onChange={() => hideProduct(product.id.toString(), !product.active)}
          />
        </div>
      </div>
    </div>
  );
}
