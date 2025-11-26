import courierIcon from "@/assets/images/icon/delivery-man.png";
import type { User } from "@/interface/ILoginResponse";
import { EllipsisVertical, Phone, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function CardCourierOther({
  courier,
  removeCourier,
}: {
  courier: User;
  removeCourier: (courierId: string, courierName: string) => Promise<void>;
}) {
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(false);
      }
    }

    if (openMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenu]);

  return (
    <div className="relative font-poppins ">
      <div className="flex justify-between items-center gap-x-5 bg-white py-2 pl-3 pr-4 rounded-xl">
        <div className="flex flex-wrap items-center gap-x-3 ">
          <div className="w-16 p-2.5 rounded-full">
            <img className="w-full" src={courierIcon} alt="Courier Photo" />
          </div>
          <div className="flex flex-col items-start justify-start gap-y-1">
            <h6 className="capitalize font-medium">
              {courier.Profile.FirstName}
            </h6>
            <p className="text-black/50 text-sm">{courier.phone}</p>
          </div>
        </div>

        <div className="flex items-center">
          <button
            className="bg-[#F05000]/20 p-2.5 rounded-full"
            onClick={() => setOpenMenu((prev) => !prev)}
          >
            <EllipsisVertical size={17} color="#F05000" />
          </button>
        </div>
      </div>

      {openMenu && (
        <div
          ref={menuRef}
          className="absolute bg-white min-w-40 shadow-2xl overflow-hidden rounded-md right-8 top-14 z-50 
                      animate-slide-down"
        >
          <ul className="flex flex-col">
            <li className="cursor-pointer px-4 py-3">
              <a
                className="flex gap-x-2 items-center "
                href={`tel:${courier.phone}`}
              >
                <Phone size={16} />
                <span>Panggil</span>
              </a>
            </li>
            <li
              className="bg-red-500 text-white flex items-center gap-x-2 cursor-pointer px-4 py-3"
              onClick={() =>
                removeCourier(courier.id, courier.Profile.FirstName)
              }
            >
              <Trash2 size={16} strokeWidth={2} />
              <span>Delete</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
