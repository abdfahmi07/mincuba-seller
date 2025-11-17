import CardProduct from "@/components/Card/CardProduct";
import StoreClosed from "@/components/StoreClosed/StoreClosed";
import { useStoreStatus } from "@/queries/useStoreStatus";

export default function ProductsPage() {
  const { data } = useStoreStatus();

  return (
    <>
      {data?.exists ? (
        <div className="py-1">
          <CardProduct />
        </div>
      ) : (
        <div className="pt-35 px-4">
          <StoreClosed />
        </div>
      )}
    </>
  );
}
