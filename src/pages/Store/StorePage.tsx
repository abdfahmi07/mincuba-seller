import { ChevronRight, Package, Pencil, Store } from "lucide-react";
import { NavLink } from "react-router-dom";
import user from "@/assets/images/product/user.jpeg";

export default function StorePage() {
  return (
    <div className="relative bg-white min-h-screen rounded-t-4xl font-poppins px-6 py-12 mt-8">
      <div className="flex justify-center items-center absolute -top-10 right-0 left-0 m-auto">
        <div className="relative w-26">
          <img
            className="rounded-full border-4 border-white w-full"
            src={user}
            alt="User"
          />
          {/* <div className="absolute bottom-1 p-0.5 right-1 bg-white border border-white rounded-full">
            <Camera color="#000" size={16} />
          </div> */}
        </div>
      </div>
      <div className="flex flex-col gap-y-1.5 p-4 mt-3">
        <div className="flex justify-center items-center gap-x-1">
          <Store color="#f05000" size={17} />
          <h6 className="text-center font-semibold">Mincuba Store</h6>
        </div>
        <p className="text-sm text-center w-[90%] m-auto">
          Jalan PLN Raya Gandul, Cinere, Kota Depok, Indonesia
        </p>
      </div>
      <ul className="bg-[#F2F2F2] rounded-lg p-5 flex flex-col gap-y-5 mt-4">
        <li className="">
          <NavLink
            to="/store/edit"
            className="flex justify-between border-b border-b-black/15 pb-4"
          >
            <div className="flex items-center gap-x-2">
              <Pencil color="#f05000" size={16} />
              <h6 className="text-sm">Edit Toko</h6>
            </div>
            <ChevronRight size={24} color="#333" />
          </NavLink>
        </li>
        <li className="">
          <NavLink to="/products" className="flex justify-between">
            <div className="flex items-center gap-x-2">
              <Package color="#f05000" size={16} />
              <h6 className="text-sm">Produk</h6>
            </div>
            <ChevronRight size={24} color="#333" />
          </NavLink>
        </li>
      </ul>
    </div>
  );
}
