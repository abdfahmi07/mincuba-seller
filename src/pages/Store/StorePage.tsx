import { ChevronRight, Package, Pencil, Store } from "lucide-react";
import { NavLink } from "react-router-dom";
import { isAxiosError } from "axios";
import { toast } from "react-toastify";
import { getMyStore } from "@/services/api/store";
import { useEffect, useState } from "react";
import type { MyStore } from "@/interface/IMyStore";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function StorePage() {
  const [store, setStore] = useState<MyStore | null>(null);
  const [isLoadingStore, setIsLoadingStore] = useState<boolean>(true);

  const fetchMyStore = async () => {
    try {
      const data = await getMyStore();
      setStore(data);
      setIsLoadingStore(false);
    } catch (err: unknown) {
      setIsLoadingStore(false);
      if (isAxiosError(err)) {
        toast.error(err.response?.data?.message ?? "Terjadi kesalahan", {
          position: "top-center",
        });
        return;
      }

      toast.error("Terjadi kesalahan tak terduga", {
        position: "top-center",
      });
    }
  };

  useEffect(() => {
    fetchMyStore();
    return () => {};
  }, []);

  return (
    <div className="relative bg-white min-h-screen rounded-t-4xl font-poppins px-6 py-12 mt-8">
      <div className="flex justify-center items-center absolute -top-10 right-0 left-0 m-auto">
        <div className="relative w-26">
          {isLoadingStore ? (
            <div className="w-26 h-26 rounded-full border-4 border-white bg-gray-400 animate-pulse"></div>
          ) : (
            <div className="w-26 h-26 flex justify-center items-center text-white rounded-full bg-[#F05000] border-4 border-white">
              <h3 className="uppercase text-3xl font-semibold">
                {store?.User.username.includes(" ")
                  ? `${store?.User.username.split(" ")[0][0]}${
                      store?.User.username.split(" ")[1][0]
                    }`
                  : `${store?.User.username[0]}${store?.User.username[1]}`}
              </h3>
            </div>
          )}

          {/* <img
            className="rounded-full border-4 border-white w-full"
            src={user}
            alt="User"
          /> */}
          {/* <div className="absolute bottom-1 p-0.5 right-1 bg-white border border-white rounded-full">
            <Camera color="#000" size={16} />
          </div> */}
        </div>
      </div>
      <div className="flex flex-col gap-y-1.5 p-4 mt-3">
        {isLoadingStore ? (
          <div className="px-10">
            <Skeleton />
          </div>
        ) : (
          <div className="flex justify-center items-center gap-x-1">
            <Store color="#f05000" size={17} />
            <h6 className="text-center font-semibold">{store?.name}</h6>
          </div>
        )}
        {isLoadingStore ? (
          <div className="px-10">
            <Skeleton count={2} />
          </div>
        ) : (
          <p className="text-sm text-center w-[90%] m-auto">
            {store?.Address.detail}
          </p>
        )}
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
