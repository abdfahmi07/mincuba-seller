import CardProduct from "@/components/Card/CardProduct";
import NotFound from "@/components/NotFound/NotFound";
import type { Product } from "@/interface/IProduct";
import { useStoreStatus } from "@/queries/useStoreStatus";
import { deleteProduct, getAllProduct } from "@/services/api/product";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import closedStore from "@/assets/images/icon/store-closed.png";
import productNotFound from "@/assets/images/icon/product-lauch.png";
import Spinner from "@/components/LoadingSpinner/Spinner";
import { confirmAlert } from "@/helpers/confirmAlert";

export default function ProductsPage() {
  const { data, isLoading: isLoadingStoreStatus } = useStoreStatus();
  const [products, setProducts] = useState<Product[]>([]);

  const removeProduct = async (productId: string, productName: string) => {
    try {
      const ok = await confirmAlert({
        title: "Hapus produk?",
        description: `Produk "${productName}" akan dihapus permanen.`,
        confirmText: "Ya, hapus",
        cancelText: "Batal",
        variant: "danger",
      });

      if (!ok) return;

      await deleteProduct(productId);
      fetchProducts();
    } catch (err: unknown) {
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

  const fetchProducts = async () => {
    try {
      const res = await getAllProduct();

      setProducts(res.data);
    } catch (err: unknown) {
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
    fetchProducts();
    return () => {};
  }, []);

  return (
    <>
      {!isLoadingStoreStatus ? (
        data?.exists ? (
          <div className="py-1">
            {products.length !== 0 ? (
              products?.map((product) => (
                <CardProduct
                  key={product.id}
                  product={product}
                  removeProduct={removeProduct}
                />
              ))
            ) : (
              <div className="pt-24 px-4">
                <NotFound
                  icon={productNotFound}
                  message="Anda belum memiliki produk. Silahkan menambahkan produk terlebih dahulu"
                  urlNavigate="/products/create"
                  titleBtn="Buat Produk"
                />
              </div>
            )}
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
        )
      ) : (
        <div className="mt-24 flex justify-center">
          <Spinner />
        </div>
      )}
    </>
  );
}
