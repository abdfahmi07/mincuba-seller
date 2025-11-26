import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Overlay from "@/components/Overlay/Overlay";
import Sidebar from "@/components/Sidebar/Sidebar";
import logo from "@/assets/images/logo/logo.png";
import BottomNavigation from "@/components/BottomNavigation/BottomNavigation";
import { useStoreStatus } from "@/queries/useStoreStatus";
import notification from "@/assets/images/icon/notification.png";

export default function MainLayout({ title }: { title?: string }) {
  const [isShowSidebar, setIsShowSidebar] = useState(false);
  const { pathname } = useLocation();
  const { data } = useStoreStatus();

  return (
    <div className="bg-[#ebebeb]">
      <div className="relative min-h-screen max-w-md m-auto overflow-hidden">
        <Sidebar
          isShowSidebar={isShowSidebar}
          setIsShowSidebar={setIsShowSidebar}
        />
        {isShowSidebar && <Overlay handleShowSidebar={setIsShowSidebar} />}

        <main className="bg-black min-h-screen h-full">
          {pathname === "/" ? (
            <header className="bg-black flex justify-between items-center pr-5 pl-1.5 py-4">
              <img className="w-52 " src={logo} alt="" />
              <div className="flex gap-x-7 items-center">
                <img
                  className="w-8 cursor-pointer"
                  src={notification}
                  alt="Notif Icon"
                />
                <div
                  className="flex flex-col gap-y-2 cursor-pointer"
                  onClick={() => setIsShowSidebar(true)}
                >
                  <div className="w-8 h-[0.18rem] bg-white rounded-2xl"></div>
                  <div className="w-8 h-[0.18rem] bg-white rounded-2xl"></div>
                  <div className="w-8 h-[0.18rem] bg-white rounded-2xl"></div>
                </div>
              </div>
            </header>
          ) : (
            <header className="bg-black flex justify-center items-center pt-8">
              <h2 className="text-white text-xl font-semibold font-poppins">
                {title === "Edit Toko"
                  ? data?.exists
                    ? title
                    : "Buka Toko"
                  : title}
              </h2>
            </header>
          )}

          <div className="py-6">
            <Outlet context={{ isShowSidebar, setIsShowSidebar }} />
          </div>
        </main>

        <BottomNavigation />
      </div>
    </div>
  );
}
