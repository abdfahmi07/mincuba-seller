import home from "@/assets/images/icon/home.png";
import courier from "@/assets/images/icon/courier.svg";
import trolley from "@/assets/images/icon/trolley.png";
import box from "@/assets/images/icon/box.png";
import { NavLink } from "react-router-dom";

export default function BottomNavigation() {
  return (
    <div className="bg-[#F05000] fixed bottom-0 w-full py-3 shadow-[0_0_12px_rgba(0,0,0,0.20)] max-w-md">
      <ul className="grid grid-cols-4 justify-items-center font-poppins">
        <li className="">
          <NavLink
            to="/"
            className="flex flex-col items-center text-xs text-white gap-y-1.5 "
          >
            <img className="w-8" src={home} alt="Home Icon" />
            <h6>Home</h6>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/couriers"
            className="flex flex-col items-center text-xs text-white gap-y-1.5 "
          >
            <img className="w-8" src={courier} alt="Courier Icon" />
            <h6>Kurir</h6>
          </NavLink>
        </li>
        <li className="">
          <NavLink
            to="/orders"
            className="flex flex-col items-center text-xs text-white gap-y-1.5 "
          >
            <img className="w-8" src={trolley} alt="Order Icon" />
            <h6>Pesanan</h6>
          </NavLink>
        </li>
        <li className=" ">
          <NavLink
            className="flex flex-col items-center text-xs text-white gap-y-1.5"
            to="/products"
          >
            <img className="w-8" src={box} alt="Product Icon" />
            <h6>Produk</h6>
          </NavLink>
        </li>
      </ul>
    </div>
  );
}
