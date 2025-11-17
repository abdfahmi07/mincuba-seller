import closedStore from "@/assets/images/icon/store-closed.png";
import { NavLink } from "react-router-dom";

export default function StoreClosed() {
  return (
    <div className="flex flex-col justify-center items-center gap-y-10 font-poppins px-4">
      <div className="flex flex-col gap-y-3 justify-center items-center text-center">
        <img className="w-45" src={closedStore} alt="Closed Store" />
        <h6>
          Anda belum membuka toko. Silakan buka toko terlebih dahulu untuk
          melanjutkan aktivitas ini.
        </h6>
      </div>
      <NavLink to="/store/edit">
        <button className="bg-[#F05000] text-white py-3 px-6 rounded-lg font-semibold cursor-pointer text-sm">
          Buka Toko
        </button>
      </NavLink>
    </div>
  );
}
