import CardCourierOther from "@/components/Card/CardCourierOther";
import NotFound from "@/components/NotFound/NotFound";
import { confirmAlert } from "@/helpers/confirmAlert";
import type { User } from "@/interface/ILoginResponse";
import { deleteCourier, getAllCourier } from "@/services/api/courier";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import courierNotFound from "@/assets/images/icon/courier-not-found.png";

export default function CourierPage() {
  const [couriers, setCouriers] = useState([]);

  const fetchCouriers = async () => {
    const res = await getAllCourier();

    setCouriers(res.data);
  };

  const removeCourier = async (courierId: string, courierName: string) => {
    try {
      const ok = await confirmAlert({
        title: "Hapus Kurir?",
        description: `Kurir "${courierName}" akan dihapus permanen.`,
        confirmText: "Ya, hapus",
        cancelText: "Batal",
        variant: "danger",
      });

      if (!ok) return;

      await deleteCourier(courierId);
      fetchCouriers();
      toast.success(`Kurir ${courierName} berhasil dihapus!`, {
        position: "top-center",
      });
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        toast.error(err.response?.data?.result?.error ?? "Terjadi kesalahan", {
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
    fetchCouriers();
  }, []);

  return (
    <div className="flex flex-col gap-y-3 p-5">
      {couriers.map((courier: User) => (
        <CardCourierOther
          key={courier.id}
          courier={courier}
          removeCourier={removeCourier}
        />
      ))}

      {couriers.length === 0 && (
        <div className="pt-24 px-4">
          <NotFound
            icon={courierNotFound}
            message="Belum ada kurir yang terdaftar. Silahkan mendaftarkan kurir terlebih dahulu"
            urlNavigate="/couriers/create"
            titleBtn="Tambah Kurir"
          />
        </div>
      )}
      <ToastContainer hideProgressBar />
    </div>
  );
}
