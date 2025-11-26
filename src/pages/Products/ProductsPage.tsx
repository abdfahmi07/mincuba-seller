import CardProduct from "@/components/Card/CardProduct";
import NotFound from "@/components/NotFound/NotFound";
import type { Product } from "@/interface/IProduct";
import { useStoreStatus } from "@/queries/useStoreStatus";
import {
  deleteProduct,
  getAllProduct,
  updateProduct,
} from "@/services/api/product";
import { isAxiosError } from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import closedStore from "@/assets/images/icon/store-closed.png";
import productNotFound from "@/assets/images/icon/product-lauch.png";
import Spinner from "@/components/LoadingSpinner/Spinner";
import { confirmAlert } from "@/helpers/confirmAlert";

export default function ProductsPage() {
  const { data, isLoading: isLoadingStoreStatus } = useStoreStatus();
  const [products, setProducts] = useState<Product[]>([]);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const loadPage = useCallback(async (pageToLoad: number) => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await getAllProduct(pageToLoad);

      setProducts((prev) => [...prev, ...res.data]);

      if (res.pagination.current_page >= res.pagination.pages) {
        setHasMore(false);
      }
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
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPage(1);
  }, [loadPage]);

  useEffect(() => {
    if (page === 1) return;
    loadPage(page);
  }, [page, loadPage]);

  useEffect(() => {
    if (!hasMore) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver((entries) => {
      const first = entries[0];
      if (!first.isIntersecting) return;
      if (loading || !hasMore) return;

      setPage((prev) => prev + 1);
    });

    if (sentinelRef.current) {
      observerRef.current.observe(sentinelRef.current);
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [hasMore, loading]); // ⬅️ ini penting

  const reloadFirstPage = () => {
    setPage(1);
    setHasMore(true);
    setProducts([]);
    loadPage(1);
  };

  const removeProduct = async (productId: string, productName: string) => {
    try {
      const ok = await confirmAlert({
        title: "Hapus Produk?",
        description: `Produk "${productName}" akan dihapus permanen.`,
        confirmText: "Ya, hapus",
        cancelText: "Batal",
        variant: "danger",
      });

      if (!ok) return;

      await deleteProduct(productId);
      reloadFirstPage();
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

  const hideProduct = async (productId: string, isActive: boolean) => {
    try {
      const payloads = {
        active: isActive,
      };
      await updateProduct(productId, payloads);
      reloadFirstPage();
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

  const isFirstPageLoading = loading && page === 1 && products.length === 0;

  return (
    <>
      {/* 1. Store status masih loading */}
      {isLoadingStoreStatus && (
        <div className="mt-24 flex justify-center">
          <Spinner />
        </div>
      )}

      {/* 2. Store tidak ada */}
      {!isLoadingStoreStatus && data && !data.exists && (
        <div className="pt-24 px-4">
          <NotFound
            icon={closedStore}
            message="Anda belum membuka toko. Silakan buka toko terlebih dahulu untuk melanjutkan aktivitas ini."
            urlNavigate="/store/create"
            titleBtn="Buka Toko"
          />
        </div>
      )}

      {/* 3. Store ADA */}
      {!isLoadingStoreStatus && data && data.exists && (
        <div className="p-4 flex flex-col gap-y-3 mb-20">
          {/* 3A. First page loading (tidak boleh tampil NotFound produk dulu) */}
          {isFirstPageLoading && (
            <div className="mt-24 flex justify-center">
              <Spinner />
            </div>
          )}

          {/* 3B. Ada produk */}
          {!isFirstPageLoading && products.length > 0 && (
            <>
              <div>
                <h6 className="font-semibold font-poppins">
                  {products.length} Produk
                </h6>
              </div>

              {products.map((product) => (
                <CardProduct
                  key={product.id}
                  product={product}
                  removeProduct={removeProduct}
                  hideProduct={hideProduct}
                />
              ))}

              {/* sentinel */}
              <div
                ref={sentinelRef}
                className="h-10 flex items-center justify-center"
              >
                {loading && (
                  <span className="text-xs text-gray-500">Loading...</span>
                )}
                {!hasMore && !loading && page !== 1 && (
                  <span className="text-xs text-gray-400 font-poppins">
                    Semua data sudah dimuat
                  </span>
                )}
              </div>
            </>
          )}

          {/* 3C. Tidak ada produk (bener-bener kosong setelah load selesai) */}
          {!isFirstPageLoading && products.length === 0 && (
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
      )}
      <ToastContainer hideProgressBar />
    </>
  );
}
