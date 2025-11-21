import CardOrder from "@/components/Card/CardOrder";
import { useStoreStatus } from "@/queries/useStoreStatus";
import closedStore from "@/assets/images/icon/store-closed.png";
import NotFound from "@/components/NotFound/NotFound";
import Tabs from "@/components/Tabs/Tabs";

export default function OrdersPage() {
  const { data } = useStoreStatus();

  return (
    <>
      <Tabs />
      {data?.exists ? (
        <div className="grid grid-cols-1 gap-3 p-4 mb-20">
          <CardOrder isIncomingOrder={true} />
          <CardOrder isIncomingOrder={false} />
          <CardOrder isIncomingOrder={true} />
          <CardOrder isIncomingOrder={false} />
        </div>
      ) : (
        <div className="pt-24 px-4">
          <NotFound
            icon={closedStore}
            message="Anda belum membuka toko. Silakan buka toko terlebih dahulu untuk
          melanjutkan aktivitas ini."
            urlNavigate="/store/create"
            titleBtn="Buka Toko"
          />
        </div>
      )}
    </>
  );
}
