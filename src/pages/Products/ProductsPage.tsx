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
import { toIDNCurrency } from "@/helpers/number";

function BottomSheetProductDetail({
  open,
  product,
  onClose,
}: {
  open: boolean;
  product: Product | null;
  onClose: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const sheetRef = useRef<HTMLDivElement | null>(null);

  // drag states
  const startYRef = useRef(0);
  const lastDeltaRef = useRef(0);
  const draggingRef = useRef(false);

  // reset expand tiap kali buka drawer baru
  useEffect(() => {
    if (open) setExpanded(false);
  }, [open, product?.id]);

  // ESC close
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  // prevent body scroll saat drawer open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // helper: set translateY on sheet
  const setSheetTranslate = (px: number) => {
    const el = sheetRef.current;
    if (!el) return;
    el.style.transform = `translateY(${px}px)`;
  };

  const setSheetTransition = (enabled: boolean) => {
    const el = sheetRef.current;
    if (!el) return;
    el.style.transition = enabled ? "transform 250ms ease-out" : "none";
  };

  const onPointerDown = (e: React.PointerEvent) => {
    // hanya drag dari "handle area" biar gak ganggu scroll konten
    draggingRef.current = true;
    startYRef.current = e.clientY;
    lastDeltaRef.current = 0;

    setSheetTransition(false);
    (e.currentTarget as HTMLDivElement).setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current) return;

    const deltaY = e.clientY - startYRef.current; // + ke bawah, - ke atas
    lastDeltaRef.current = deltaY;

    // rules:
    // - drag ke bawah: sheet ikut turun (translate positif avoid minus)
    // - drag ke atas: kasih sedikit "resistance" biar gak liar
    if (deltaY > 0) {
      setSheetTranslate(deltaY);
    } else {
      // resistance saat tarik ke atas
      setSheetTranslate(deltaY * 0.25);
    }
  };

  const onPointerUp = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;

    setSheetTransition(true);
    setSheetTranslate(0);

    const deltaY = lastDeltaRef.current;

    // threshold swipe
    const SWIPE_DOWN_CLOSE = 140; // tarik ke bawah segini = close (kalau collapsed)
    const SWIPE_UP_EXPAND = -90; // tarik ke atas segini = expand
    const SWIPE_DOWN_COLLAPSE = 90; // kalau expanded, tarik ke bawah segini = collapse

    if (deltaY <= SWIPE_UP_EXPAND) {
      setExpanded(true);
      return;
    }

    if (expanded) {
      if (deltaY >= SWIPE_DOWN_COLLAPSE) {
        setExpanded(false);
      }
      return;
    }

    // collapsed state
    if (deltaY >= SWIPE_DOWN_CLOSE) {
      onClose();
    }
  };

  if (!open) return null;

  const title = product?.name ?? "Detail Produk";

  return (
    <div className="fixed inset-0 z-999">
      {/* backdrop */}
      <button
        aria-label="Close drawer"
        onClick={onClose}
        className="absolute inset-0 bg-black/50"
      />

      {/* sheet */}
      <div
        ref={sheetRef}
        className={[
          "absolute left-0 right-0 bottom-0",
          "bg-white rounded-t-3xl shadow-2xl",
          "transition-transform duration-300 ease-out",
          open ? "translate-y-0" : "translate-y-full",
          expanded ? "h-[92vh]" : "h-[52vh]",
          "flex flex-col",
        ].join(" ")}
        role="dialog"
        aria-modal="true"
      >
        {/* DRAG HANDLE AREA (only this area draggable) */}
        <div
          className="px-4 pt-3 pb-2 border-b select-none"
          style={{ touchAction: "none" }} // ✅ penting untuk drag
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <div className="mx-auto h-1.5 w-12 rounded-full bg-gray-300 mb-3" />

          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col">
              <h3 className="font-poppins font-semibold text-base leading-6 mt-1 mb-2">
                {title}
              </h3>
              {/* <p className="text-xs text-gray-500">
                Drag ke atas untuk Perluas • Drag ke bawah untuk Tutup
              </p> */}
            </div>
          </div>
        </div>

        {/* content scrollable */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {!product ? (
            <div className="text-sm text-gray-600">Tidak ada data produk</div>
          ) : (
            <div className="space-y-4">
              {/* preview image (ambil field sesuai struktur produk kamu) */}
              <div className="rounded-2xl border p-3">
                <div className="flex gap-3">
                  <div className="w-24 h-24 rounded-xl bg-gray-100 overflow-hidden flex items-center justify-center">
                    {/* sesuaikan: product.images[0]?.url / product.image / dll */}
                    {(product as Product)?.ProductImage?.[0]?.url ? (
                      <img
                        src={(product as Product).ProductImage[0].url}
                        alt={title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-[10px] text-gray-400">
                        No Image
                      </span>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-poppins font-semibold text-sm">
                        {title}
                      </p>
                      {/* <span
                        className={[
                          "text-[11px] px-2 py-1 rounded-full border font-poppins",
                          (product as Product)?.active === false
                            ? "bg-gray-50 text-gray-600"
                            : "bg-emerald-50 text-emerald-700 border-emerald-200",
                        ].join(" ")}
                      >
                        {(product as Product)?.active === false
                          ? "Nonaktif"
                          : "Aktif"}
                      </span> */}
                    </div>

                    <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                      <div className="rounded-xl bg-gray-50 p-2">
                        <p className="text-gray-500">Harga</p>
                        <p className="font-poppins font-semibold text-gray-900 mt-1">
                          {(product as Product)?.unit === "liter"
                            ? toIDNCurrency((product as Product)?.price) +
                              "/" +
                              (product as Product)?.unit
                            : toIDNCurrency((product as Product)?.price)}
                        </p>
                      </div>

                      <div className="rounded-xl bg-gray-50 p-2">
                        <p className="text-gray-500">Stok</p>
                        <p className="font-poppins font-semibold text-gray-900 mt-1">
                          {(product as Product)?.unit !== "grams"
                            ? `${(product as Product)?.stock} ${
                                (product as Product)?.unit
                              }`
                            : `${(product as Product)?.stock} barang`}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* sections */}
              <div className="rounded-2xl border p-4 space-y-3">
                <h4 className="font-poppins font-semibold text-sm">
                  Informasi Produk
                </h4>
                {(product as Product).unit === "grams" && (
                  <InfoRow
                    label="Berat"
                    value={
                      (product as Product)?.unit
                        ? `${(product as Product).weight} ${
                            (product as Product)?.unit
                          }`
                        : "-"
                    }
                  />
                )}

                <InfoRow
                  label="Min. Order"
                  value={
                    (product as Product)?.unit !== "grams"
                      ? `${(product as Product)?.min} ${
                          (product as Product)?.unit
                        }`
                      : `${(product as Product)?.min} barang`
                  }
                />
              </div>

              <div className="rounded-2xl border p-4 space-y-3">
                <h4 className="font-poppins font-semibold text-sm">
                  Deskripsi
                </h4>

                <p
                  className="text-sm text-gray-700 leading-6"
                  dangerouslySetInnerHTML={{
                    __html: (product as Product)?.description,
                  }}
                ></p>
              </div>
              <div className="h-6" />
            </div>
          )}
        </div>

        {/* sticky actions bottom */}
        <div className="border-t px-4 py-3 bg-white">
          <div className="flex gap-2">
            <button
              onClick={() => setExpanded(true)}
              className="flex-1 font-poppins text-sm py-2.5 rounded-2xl border hover:bg-gray-50"
            >
              Lihat Full Detail
            </button>
            <button
              onClick={onClose}
              className="flex-1 font-poppins text-sm py-2.5 rounded-2xl bg-gray-900 text-white hover:opacity-90"
            >
              Selesai
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: unknown }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-xs font-poppins font-semibold text-gray-900 text-right">
        {String(value ?? "-")}
      </p>
    </div>
  );
}

export default function ProductsPage() {
  const loadingRef = useRef(false);
  const { data, isLoading: isLoadingStoreStatus } = useStoreStatus();
  const [products, setProducts] = useState<Product[]>([]);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // drawer state
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const openDetail = (p: Product) => {
    setSelectedProduct(p);
    setDetailOpen(true);
  };
  const closeDetail = () => {
    setDetailOpen(false);
    // optional: biar animasi halus, clear setelah close sedikit delay
    setTimeout(() => setSelectedProduct(null), 200);
  };

  const loadPage = useCallback(async (pageToLoad: number) => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);

    try {
      const res = await getAllProduct(pageToLoad);

      setProducts((prev) => [...prev, ...(res.data ?? [])]);

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
      toast.error("Terjadi kesalahan tak terduga", { position: "top-center" });
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, []);

  useEffect(() => {
    loadPage(page);
  }, [page, loadPage]);

  useEffect(() => {
    if (!hasMore) return;

    observerRef.current?.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (!first?.isIntersecting) return;
        if (loadingRef.current) return; // ✅ penting
        setPage((prev) => prev + 1); // ✅ load more
      },
      {
        root: null,
        rootMargin: "200px", // ✅ biar fetch sebelum mentok bawah
        threshold: 0,
      }
    );

    if (sentinelRef.current) observerRef.current.observe(sentinelRef.current);

    return () => observerRef.current?.disconnect();
  }, [hasMore]);

  const reloadFirstPage = () => {
    setProducts([]);
    setHasMore(true);
    setPage(1); // ✅ effect akan fetch page 1 lagi
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
      toast.error("Terjadi kesalahan tak terduga", { position: "top-center" });
    }
  };

  const hideProduct = async (productId: string, isActive: boolean) => {
    try {
      const payloads = { active: isActive };
      await updateProduct(productId, payloads);
      reloadFirstPage();
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        toast.error(err.response?.data?.result?.error ?? "Terjadi kesalahan", {
          position: "top-center",
        });
        return;
      }
      toast.error("Terjadi kesalahan tak terduga", { position: "top-center" });
    }
  };

  const isFirstPageLoading = loading && page === 1 && products.length === 0;

  return (
    <>
      {isLoadingStoreStatus && (
        <div className="mt-24 flex justify-center">
          <Spinner />
        </div>
      )}

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

      {!isLoadingStoreStatus && data && data.exists && (
        <div className="p-4 flex flex-col gap-y-3 mb-20">
          {isFirstPageLoading && (
            <div className="mt-24 flex justify-center">
              <Spinner />
            </div>
          )}

          {!isFirstPageLoading && products.length > 0 && (
            <>
              <div>
                <h6 className="font-semibold font-poppins">
                  {products.length} Produk
                </h6>
                <p className="text-xs text-gray-500">
                  Tap item untuk lihat detail (drawer)
                </p>
              </div>

              {products.map((product) => (
                <div key={product.id} onClick={() => openDetail(product)}>
                  <CardProduct
                    product={product}
                    removeProduct={removeProduct}
                    hideProduct={hideProduct}
                  />
                </div>
              ))}

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

      {/* Drawer detail */}
      <BottomSheetProductDetail
        open={detailOpen}
        product={selectedProduct}
        onClose={closeDetail}
      />

      <ToastContainer hideProgressBar />
    </>
  );
}
