import { formatIDNDecimal, toIDNCurrency } from "@/helpers/number";
import type { Product } from "@/interface/IProduct";
import imageBroken from "@/assets/images/icon/image-broke.png";
import { Pencil, Trash } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function CardProduct({
  product,
  removeProduct,
}: {
  product: Product;
  removeProduct: (productId: string, productName: string) => Promise<void>;
}) {
  return (
    <div className="flex justify-between items-start px-4 py-5 gap-x-3 font-poppins border-b-2 border-b-black/10">
      <div className="flex gap-x-3">
        <img
          className="rounded-xl w-20 h-20 object-cover"
          src={
            product.ProductImage.length !== 0
              ? product.ProductImage[0].url
              : imageBroken
          }
          alt="Product Image"
        />
        <div className="flex flex-col gap-y-1">
          <h5 className="text-sm font-semibold">{product.name}</h5>
          <h5 className="text-sm font-semibold text-[#D33E3E]">
            {toIDNCurrency(product.price)} / {product.unit}
          </h5>
          <h6 className="text-xs text-[#6E6E6E]">
            Stock:{" "}
            <span className="font-semibold text-black">
              {formatIDNDecimal(product.stock)}
            </span>
          </h6>
        </div>
      </div>
      <div className="flex gap-x-2 self-end">
        <NavLink to={`/products/edit/${product.id}`}>
          <button className="flex items-center gap-x-2 border-2 border-[#F05000] rounded-lg text-sm p-2 text-white  cursor-pointer">
            <Pencil size={18} color="#F05000" />
          </button>
        </NavLink>
        <button
          className="bg-red-500 rounded-lg text-sm p-2 text-white cursor-pointer"
          onClick={() => removeProduct(product.id.toString(), product.name)}
        >
          <Trash size={18} color="#fff" />
        </button>
      </div>
    </div>
  );
}
