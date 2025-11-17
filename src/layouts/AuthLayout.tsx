import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#ebebeb]">
      <div className="w-full h-screen max-w-md px-6 pb-6 pt-5 bg-white">
        <Outlet />
      </div>
    </div>
  );
}
