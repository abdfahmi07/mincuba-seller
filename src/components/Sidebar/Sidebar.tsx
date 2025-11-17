import logo from "@/assets/images/logo/logo.png";
import settings from "@/assets/images/icon/settings.png";
import store from "@/assets/images/icon/store.png";
import info from "@/assets/images/icon/info.png";
import { useNavigate } from "react-router-dom";
import { logout } from "@/services/api/auth";
import { useStoreStatus } from "@/queries/useStoreStatus";

type SidebarProps = {
  isShowSidebar: boolean;
  setIsShowSidebar: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Sidebar({
  isShowSidebar,
  setIsShowSidebar,
}: SidebarProps) {
  const navigate = useNavigate();
  const { data } = useStoreStatus();

  const onLogout = () => {
    logout();
    navigate("/auth/login");
  };

  const navigateToStorePage = () => {
    if (data?.exists) {
      navigate("/store");
    } else {
      navigate("/store/edit");
    }

    setIsShowSidebar(false);
  };

  return (
    <aside
      className={`flex flex-col justify-between fixed z-20 top-0 right-0 min-h-screen h-screen w-64 bg-black text-white transition-transform duration-300
      ${isShowSidebar ? "translate-x-0" : "translate-x-full"}`}
    >
      <div className="pt-8 pb-20 h-full">
        <div className="flex justify-center">
          <img className="w-32" src={logo} alt="Mincuba" />
        </div>
        <div className="flex flex-col justify-between h-full px-4">
          <ul className="flex flex-col gap-y-5 font-poppins text-sm mt-10">
            <li
              className="flex gap-x-2 items-center"
              onClick={navigateToStorePage}
            >
              <img className="w-8 h-8" src={store} alt="Toko Saya" />
              <h4>{data?.exists ? "Toko Saya" : "Buka Toko"}</h4>
            </li>
            <li className="flex gap-x-2 items-center">
              <img className="w-8 h-8" src={settings} alt="Setting" />
              <h4>Settings</h4>
            </li>
            <li className="flex gap-x-2 items-center">
              <img className="w-8 h-8" src={info} alt="Informasi Layanan" />
              <h4>Informasi layanan</h4>
            </li>
          </ul>
          <div className="flex flex-col items-center gap-y-6 font-poppins">
            <button
              className="bg-[#F05000] text-white font-semibold text-sm w-full py-2 rounded-lg"
              onClick={onLogout}
            >
              Keluar
            </button>
            <span className="text-white text-xs">Powered by LD78</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
