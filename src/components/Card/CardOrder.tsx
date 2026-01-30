import moment from "moment";
import { formatNumberWithDots } from "@/helpers/number";
import type { Order, OrderItem } from "@/interface/IOrder";
import { STATUS_ORDER } from "@/utils/constants";
import { useState } from "react";
import { ChevronDown, ChevronUp, Package } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function CardOrder({
  order,
  handleConfirmOrder,
  handleReadyToPickupOrder,
  handleRejectOrder,
}: {
  order: Order;
  handleConfirmOrder: (orderId: number) => void;
  handleReadyToPickupOrder: (orderId: number) => void;
  handleRejectOrder: (orderId: number, reason: string) => void;
}) {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [loadingReject, setLoadingReject] = useState(false);
  const [expanded, setExpanded] = useState<boolean>(false);

  return (
    <>
      <NavLink to={`/orders/${order.id}`}>
        <div className="flex flex-col gap-y-4 rounded-xl bg-white p-4 font-poppins">
          <div className="flex items-start justify-between border-b-2 border-b-[#F2F2F2] ">
            <div className="flex flex-col gap-y-0.5 pb-2">
              <h6 className="#A7A5A5 text-sm">Pembelian</h6>
              <h5 className="font-semibold text-sm">
                {order.Payment.payment_at
                  ? moment(order.Payment.payment_at).format("DD MMM YYYY H:mm")
                  : "-"}
              </h5>
            </div>
            {/* {!isIncomingOrder && ( */}
            <button
              className={`text-sm mt-1 py-2 px-2.5 text-white ${order.status === "COMPLETE" ? "bg-[#15b100]" : order.status === "CANCEL" ? "bg-[#d70000]" : "bg-[#F05000]"}  rounded-md`}
            >
              {order.status
                ? STATUS_ORDER[order.status as keyof typeof STATUS_ORDER].title
                : "Pesanan Baru"}
            </button>
            {/* )} */}
          </div>
          <div className="flex flex-col gap-y-2">
            <div className="flex gap-x-1 items-center mb-2">
              <Package color="#F05000" size={18} />
              <h6 className="capitalize text-[15px]">
                {order.data.shipping.shipping_method}
              </h6>
            </div>
            {order.OrderItems.slice(0, 1).map(
              (orderItem: OrderItem, index: number) => {
                if (orderItem.Product) {
                  return (
                    <div key={index} className="flex items-start gap-x-3">
                      <img
                        className="w-18 h-16 object-cover rounded-md"
                        src={
                          orderItem.Product.ProductImage?.[0]?.url ??
                          "/images/product-placeholder.png"
                        }
                        alt={orderItem.Product.name}
                      />

                      <div className="flex flex-col gap-y-1 w-full">
                        <h5 className="font-semibold text-base">
                          {orderItem.Product.name}
                        </h5>

                        <div className="flex justify-between">
                          <h6 className="text-sm">
                            {`${formatNumberWithDots(String(orderItem.qty))} ${
                              orderItem.Product.unit === "liter"
                                ? "liter"
                                : "barang"
                            }`}
                          </h6>
                          <h6 className="text-sm">
                            Rp {formatNumberWithDots(orderItem.total_price)}
                          </h6>
                        </div>
                      </div>
                    </div>
                  );
                }
              },
            )}

            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out
        ${expanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"}`}
            >
              <div className="flex flex-col gap-y-3 mt-3">
                {order.OrderItems.slice(1).map(
                  (orderItem: OrderItem, index: number) => {
                    if (orderItem.Product) {
                      return (
                        <div key={index} className="flex items-start gap-x-3">
                          <img
                            className="w-18 h-16 object-cover rounded-md"
                            src={
                              orderItem.Product.ProductImage?.[0]?.url ??
                              "/images/product-placeholder.png"
                            }
                            alt={orderItem.Product.name}
                          />

                          <div className="flex flex-col gap-y-1 w-full">
                            <h5 className="font-semibold text-base">
                              {orderItem.Product.name}
                            </h5>

                            <div className="flex justify-between">
                              <h6 className="text-sm">
                                {`${formatNumberWithDots(String(orderItem.qty))} ${
                                  orderItem.Product.unit === "liter"
                                    ? "liter"
                                    : "barang"
                                }`}
                              </h6>
                              <h6 className="text-sm">
                                Rp {formatNumberWithDots(orderItem.total_price)}
                              </h6>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  },
                )}
              </div>
            </div>

            {order.OrderItems.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setExpanded(!expanded);
                }}
                className="text-sm text-gray-600 font-medium"
              >
                {expanded ? (
                  <span className="flex gap-x-1 justify-center items-center">
                    Tutup <ChevronUp size={14} />
                  </span>
                ) : (
                  <span className="flex gap-x-1 justify-center items-center">
                    Lihat Semua <ChevronDown size={14} />
                  </span>
                )}
              </button>
            )}
          </div>

          <div className="flex justify-between">
            <h6 className="text-black/60 font-medium text-sm">Total Harga</h6>
            <h5 className="font-semibold text-[15px]">
              Rp {formatNumberWithDots(order.Payment.total_price)}
            </h5>
          </div>
          {!order.status && (
            <div className="grid grid-cols-2 gap-3">
              <button
                className="bg-[#F00000] p-2 rounded-lg text-white cursor-pointer text-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setShowRejectModal(true);
                }}
              >
                Tolak Pesanan
              </button>
              <button
                className="bg-[#1EC500] p-2 rounded-lg text-white cursor-pointer text-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleConfirmOrder(order.id);
                }}
              >
                Terima
              </button>
            </div>
          )}
          {order.status === "CONFIRM" && (
            <div className="grid grid-cols-1 gap-3">
              <button
                className="bg-[#1EC500] p-2 rounded-lg text-white cursor-pointer text-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleReadyToPickupOrder(order.id);
                }}
              >
                Siap Diambil
              </button>
            </div>
          )}
        </div>
      </NavLink>
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
                    handleRejectOrder(order.id, rejectReason);
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
    </>
  );
}
