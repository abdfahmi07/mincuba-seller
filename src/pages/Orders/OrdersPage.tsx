import CardOrder from "@/components/Card/CardOrder";
import StoreClosed from "@/components/StoreClosed/StoreClosed";
import { useStoreStatus } from "@/queries/useStoreStatus";

export default function OrdersPage() {
  const { data } = useStoreStatus();

  return (
    <>
      {data?.exists ? (
        <div className="grid grid-cols-1 gap-3 p-4 mb-20">
          <CardOrder isIncomingOrder={true} />
          <CardOrder isIncomingOrder={false} />
          <CardOrder isIncomingOrder={true} />
          <CardOrder isIncomingOrder={false} />
        </div>
      ) : (
        <div className="pt-35 px-4">
          <StoreClosed />
        </div>
      )}
    </>
  );
}
