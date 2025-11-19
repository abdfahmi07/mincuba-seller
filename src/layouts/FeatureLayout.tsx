import { NavLink, Outlet, useNavigate } from "react-router-dom";
import BottomNavigation from "@/components/BottomNavigation/BottomNavigation";
import { ChevronLeft, Plus } from "lucide-react";
import { useStoreStatus } from "@/queries/useStoreStatus";

export default function FeatureLayout({
  title,
  isIcon = false,
  bgColor = "#fff",
}: {
  title: string;
  isIcon?: boolean;
  bgColor?: string;
}) {
  const { data } = useStoreStatus();
  const navigate = useNavigate();

  return (
    <div className="bg-white">
      <div className="min-h-screen max-w-md m-auto">
        <main className={`bg-[${bgColor}] min-h-screen h-full`}>
          <header className="bg-[#F05000] grid grid-cols-[1fr_2fr_1fr] justify-items-center px-4 py-5">
            <button
              onClick={() => navigate(-1)}
              className="justify-self-start cursor-pointer"
            >
              <ChevronLeft color="#fff" strokeWidth={3} />
            </button>
            <h4 className="text-white text-lg font-semibold font-poppins">
              {title}
            </h4>
            {isIcon && data?.exists && (
              <NavLink to="/products/create" className="justify-self-end">
                <Plus color="#fff" strokeWidth={3} />
              </NavLink>
            )}
          </header>

          <div className="">
            <Outlet />
          </div>
        </main>

        <BottomNavigation />
      </div>
    </div>
  );
}
