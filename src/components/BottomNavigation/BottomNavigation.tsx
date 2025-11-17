import home from "@/assets/images/icon/home.png";
import notification from "@/assets/images/icon/notification.png";
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
        <li className="flex flex-col items-center text-xs text-white gap-y-1.5 ">
          <img className="w-8" src={notification} alt="Notif Icon" />
          <h6>Notification</h6>
        </li>
        <li className="">
          <NavLink
            to="/orders"
            className="flex flex-col items-center text-xs text-white gap-y-1.5 "
          >
            <img className="w-8" src={trolley} alt="Pesanan Icon" />
            <h6>Pesanan</h6>
          </NavLink>
        </li>
        <li className=" ">
          <NavLink
            className="flex flex-col items-center text-xs text-white gap-y-1.5"
            to="/products"
          >
            <img className="w-8" src={box} alt="Produk Icon" />
            <h6>Produk</h6>
          </NavLink>
        </li>
      </ul>
    </div>
  );
}
