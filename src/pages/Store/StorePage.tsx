import { ChevronRight, Package, Pencil, Store } from "lucide-react";
import { NavLink } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import { useStoreStatus } from "@/queries/useStoreStatus";
import "react-loading-skeleton/dist/skeleton.css";

export default function StorePage() {
  const { data: dataStore, isLoading: isLoadingStoreStatus } = useStoreStatus();

  return (
    <div className="relative bg-white min-h-screen rounded-t-4xl font-poppins px-6 py-12 mt-8">
      <div className="flex justify-center items-center absolute -top-10 right-0 left-0 m-auto">
        <div className="relative w-26">
          {isLoadingStoreStatus ? (
            <div className="w-26 h-26 rounded-full border-4 border-white bg-gray-400 animate-pulse"></div>
          ) : dataStore?.data?.avatar_link ? (
            <img
              src={dataStore?.data?.avatar_link}
              alt="Avatar Store"
              className="w-26 h-26 rounded-full object-cover"
            />
          ) : (
            <div className="w-26 h-26 flex justify-center items-center text-white rounded-full bg-[#F05000] border-4 border-white">
              <h3 className="uppercase text-3xl font-semibold">
                {dataStore?.data?.User.username.includes(" ")
                  ? `${dataStore?.data?.User.username.split(" ")[0][0]}${
                      dataStore?.data?.User.username.split(" ")[1][0]
                    }`
                  : `${dataStore?.data?.User.username[0]}${dataStore?.data?.User.username[1]}`}
              </h3>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-y-1.5 p-4 mt-3">
        {isLoadingStoreStatus ? (
          <div className="px-10">
            <Skeleton />
          </div>
        ) : (
          <div className="flex justify-center items-center gap-x-1">
            <Store color="#f05000" size={17} />
            <h6 className="text-center font-semibold">
              {dataStore?.data?.name}
            </h6>
          </div>
        )}
        {isLoadingStoreStatus ? (
          <div className="px-10">
            <Skeleton count={2} />
          </div>
        ) : (
          <p className="text-sm text-center m-auto">
            {`${dataStore?.data?.Address.detail}, ${dataStore?.data?.Address.sub_district}, ${dataStore?.data?.Address.district}, ${dataStore?.data?.Address.city}, ${dataStore?.data?.Address.province}, ${dataStore?.data?.Address.postal_code}`}
          </p>
        )}
      </div>
      <ul className="bg-[#F2F2F2] rounded-lg p-4.5 flex flex-col gap-y-5 mt-4">
        <li className="">
          <NavLink
            to="/store/edit"
            className="flex justify-between border-b border-b-black/15 pb-4"
          >
            <div className="flex items-center gap-x-2">
              <Pencil color="#f05000" size={16} />
              <h6 className="text-sm font-medium text-black/70">Edit Toko</h6>
            </div>
            <ChevronRight size={24} color="#333" />
          </NavLink>
        </li>
        <li className="">
          <NavLink to="/products" className="flex justify-between">
            <div className="flex items-center gap-x-2">
              <Package color="#f05000" size={16} />
              <h6 className="text-sm font-medium text-black/70">Produk</h6>
            </div>
            <ChevronRight size={24} color="#333" />
          </NavLink>
        </li>
      </ul>
    </div>
  );
}
