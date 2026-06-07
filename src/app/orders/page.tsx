"use client";

import { useEffect, useState } from "react";
import api from "../../lib/axios";
import { Package, Clock, CheckCircle2 } from "lucide-react";

interface OrderItem {
  id: string;
  price: number;
  quantity: number;
  variant: {
    product: {
      name: string;
      image: string;
    };
  };
}

interface Order {
  id: string;
  status: string;
  totalPrice: number;
  createdAt: string;
  items: OrderItem[];
}

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders/my-orders");
        // Log để kiểm tra cấu trúc dữ liệu nếu cần
        setOrders(res.data.data);
      } catch (err) {
        console.error("Lỗi lấy đơn hàng:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-500 font-bold">
          Đang tải đơn hàng...
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 font-sans text-gray-800">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-black mb-8">Lịch sử đơn hàng</h1>

        {orders.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl text-center border shadow-sm">
            <Package size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">Sếp chưa có đơn hàng nào cả.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
              >
                <div className="flex justify-between items-center mb-4 pb-4 border-b">
                  <div>
                    <p className="text-sm text-gray-400">
                      Mã đơn: #{order.id.slice(-6)}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                      order.status === "PAID"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.status === "PAID" ? (
                      <CheckCircle2 size={14} />
                    ) : (
                      <Clock size={14} />
                    )}
                    {order.status === "PAID" ? "Đã thanh toán" : "Chờ xử lý"}
                  </span>
                </div>

                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl border border-gray-100 bg-gray-50 overflow-hidden flex-shrink-0">
                        <img
                          // Logic xử lý ảnh: Tự động trỏ về Backend nếu chưa có http
                          src={
                            item.variant?.product?.image?.startsWith("http")
                              ? item.variant.product.image
                              : `http://localhost:5000${item.variant?.product?.image?.startsWith("/") ? "" : "/"}${item.variant?.product?.image || ""}`
                          }
                          alt={item.variant?.product?.name || "Sản phẩm"}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://placehold.co/100x100?text=No+Img";
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">
                          {item.variant?.product?.name ||
                            "Sản phẩm không xác định"}
                        </p>
                        <p className="text-xs text-gray-500">
                          Số lượng: {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-semibold whitespace-nowrap">
                        {formatPrice(item.price)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t text-right">
                  <p className="text-sm text-gray-500">Tổng tiền</p>
                  <p className="text-xl font-black text-blue-600">
                    {formatPrice(order.totalPrice)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
