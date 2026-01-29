import { formatNumberWithDots } from "@/helpers/number";
import type { Order, OrderItem } from "@/interface/IOrder";
import {
  confirmOrder,
  getOrderById,
  readyToPickupOrder,
  rejectOrder,
} from "@/services/api/order";
import { STATUS_ORDER } from "@/utils/constants";
import { isAxiosError } from "axios";
import { Package } from "lucide-react";
import moment from "moment";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const DetailOrderPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [loadingReject, setLoadingReject] = useState(false);

  const getDetailOrder = async () => {
    try {
      const data = await getOrderById(Number(orderId));
      setOrder(data);
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
    getDetailOrder();
  }, [orderId]);

  const handleConfirmOrder = async (orderId: number) => {
    try {
      await confirmOrder(orderId);
      getDetailOrder();
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

  const handleReadyToPickupOrder = async (orderId: number) => {
    try {
      await readyToPickupOrder(orderId);
      getDetailOrder();
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

  const handleRejectOrder = async (orderId: number, reason: string) => {
    try {
      await rejectOrder(orderId, { reason });
      getDetailOrder();
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

  return (
    <>
      <div className="grid grid-cols-1 gap-3 p-4 font-poppins mb-10">
        <div className="bg-white rounded-lg overflow-hidden ">
          <div
            className={`${order?.status === "COMPLETE" ? "bg-[#15b100]" : order?.status === "CANCEL" ? "bg-[#d70000]" : "bg-[#F05000]"} px-4 py-3`}
          >
            <h5 className="text-white text-[15px] font-medium">
              {order?.status
                ? STATUS_ORDER[order.status as keyof typeof STATUS_ORDER].title
                : "Pesanan Baru"}
            </h5>
          </div>
          <div className="flex flex-col gap-y-1 text-sm py-3 px-4">
            <h6 className="text-gray-500">{order?.invoice}</h6>
            <div className="flex items-center justify-between">
              <h6 className="text-gray-500">Tanggal Pembelian</h6>
              <h6 className="font-medium ">
                {order?.Payment.payment_at
                  ? moment(order?.Payment.payment_at).format(
                      "DD MMM YYYY, HH:mm",
                    )
                  : "-"}
              </h6>
            </div>
          </div>
        </div>
        <div className="flex flex-col bg-white rounded-lg">
          <div className="py-3 px-4">
            <h5 className="text-[15px] font-medium border-b border-b-gray-300 pb-2.5">
              Metode Pengiriman
            </h5>
            <div className="flex flex-col gap-y-3 text-sm mt-2">
              <div className="flex flex-col gap-y-2">
                {/* <h6>Metode Pengiriman</h6> */}
                <div className="flex flex-col gap-y-1 capitalize">
                  <p className="flex items-center gap-x-1">
                    <Package color="#F05000" size={18} />
                    <span className="text-[15px] text-[#F05000] font-medium">
                      {order?.data.shipping.shipping_method}
                    </span>
                  </p>
                  <p className="text-gray-700">{`${order?.Store.Address.detail}, ${order?.Store.Address.sub_district}, ${order?.Store.Address.district}, ${order?.Store.Address.city}, ${order?.Store.Address.province}, ${order?.Store.Address.postal_code}`}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col bg-white rounded-lg">
          <div className="py-3 px-4">
            <h5 className="text-[15px] font-medium border-b border-b-gray-300 pb-2.5">
              Informasi Produk
            </h5>
          </div>
          <div className="flex flex-col gap-y-4 pb-4 pt-1 px-4">
            {order?.OrderItems.map((orderItem: OrderItem, index: number) => (
              <div key={index} className="flex items-start gap-x-3">
                <img
                  className="w-18 h-16 object-cover rounded-md"
                  src={
                    orderItem.Product.ProductImage?.[0]?.url ??
                    "/images/product-placeholder.png"
                  }
                  alt={orderItem.Product.name}
                />

                <div className="flex flex-col gap-y-1.5 w-full">
                  <h5 className="font-semibold text-sm">
                    {orderItem.Product.name}
                  </h5>

                  <div className="flex justify-between">
                    <h6 className="text-sm">
                      {`${formatNumberWithDots(String(orderItem.qty))} ${
                        orderItem.Product.unit === "liter" ? "liter" : "barang"
                      }`}
                    </h6>
                    <h6 className="text-sm">
                      Rp {formatNumberWithDots(orderItem.total_price)}
                    </h6>
                  </div>
                </div>
              </div>
            ))}
            <div className="flex flex-col gap-y-2 mt-2">
              <div className="flex justify-between">
                <h6 className="text-black/60 text-sm">Harga Barang</h6>
                <h5 className="text-sm">
                  {" "}
                  {order
                    ? `Rp ${formatNumberWithDots(order.Payment.price)}`
                    : "-"}
                </h5>
              </div>
              <div className="flex justify-between">
                <h6 className="text-black/60 text-sm">Biaya Layanan</h6>
                <h5 className="text-sm">
                  {" "}
                  {order
                    ? `Rp ${formatNumberWithDots(order.Payment.fee_price)}`
                    : "-"}
                </h5>
              </div>
              <div className="flex justify-between">
                <h6 className="text-black/60 text-sm">Total Harga</h6>
                <h5 className="font-semibold text-[15px]">
                  {" "}
                  {order
                    ? `Rp ${formatNumberWithDots(order.Payment.total_price)}`
                    : "-"}
                </h5>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col bg-white rounded-lg">
          <div className="py-3 px-4">
            <h5 className="text-[15px] font-medium border-b border-b-gray-300 pb-2.5">
              Pembayaran
            </h5>
            <div className="flex flex-col gap-y-3 text-sm mt-2">
              <div className="flex flex-col gap-y-2">
                {/* <h6>Metode Pengiriman</h6> */}
                <div className="flex items-center justify-between text-gray-500">
                  <p className="">Metode Pembayaran</p>
                  <p className=" uppercase">
                    Bank {order?.data.payment.data.bank}
                  </p>
                </div>
                <div className="flex items-center justify-between text-gray-500">
                  <h6 className="">Email Pembeli</h6>
                  <h6 className="">{order?.User.email}</h6>
                </div>
                <div className="flex items-center justify-between text-gray-500">
                  <h6 className="">No. Handphone</h6>
                  <h6 className="">{order?.User.phone}</h6>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-2">
          {!order?.status && (
            <div className="grid grid-cols-2 gap-3">
              <button
                className="bg-[#F00000] px-2 py-3 rounded-lg text-white cursor-pointer text-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setShowRejectModal(true);
                }}
              >
                Tolak Pesanan
              </button>
              <button
                className="bg-[#1EC500] px-2 py-3 rounded-lg text-white cursor-pointer text-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  if (order) {
                    handleConfirmOrder(order.id);
                  }
                }}
              >
                Terima
              </button>
            </div>
          )}
          {order?.status === "CONFIRM" && (
            <div className="grid grid-cols-1 gap-3">
              <button
                className="bg-[#1EC500] px-2 py-3 rounded-lg text-white cursor-pointer text-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  if (order) {
                    handleReadyToPickupOrder(order.id);
                  }
                }}
              >
                Siap Diambil
              </button>
            </div>
          )}
        </div>
      </div>
      {showRejectModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setShowRejectModal(false)}
        >
          <div
            className="bg-white rounded-xl w-[90%] max-w-md p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="text-base font-semibold mb-2">Tolak Pesanan</h4>

            <p className="text-sm text-gray-500 mb-3">
              Masukkan alasan penolakan pesanan
            </p>

            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Contoh: Stok habis, toko tutup, dll"
              className="w-full border rounded-lg p-2 text-sm resize-none h-24 focus:outline-none focus:ring-1 focus:ring-[#F05000]"
            />

            <div className="flex gap-2 mt-4">
              <button
                className="flex-1 border rounded-lg py-2 text-sm"
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason("");
                }}
              >
                Batal
              </button>

              <button
                disabled={!rejectReason || loadingReject}
                className="flex-1 bg-[#F00000] text-white rounded-lg py-2 text-sm disabled:opacity-50"
                onClick={async () => {
                  try {
                    setLoadingReject(true);
                    if (order) {
                      handleRejectOrder(order.id, rejectReason);
                    }
                    setShowRejectModal(false);
                    setRejectReason("");
                  } finally {
                    setLoadingReject(false);
                  }
                }}
              >
                {loadingReject ? "Mengirim..." : "Kirim"}
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer hideProgressBar />
    </>
  );
};

export default DetailOrderPage;
