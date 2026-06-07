"use client";

import Link from "next/link";
import { useCartStore } from "../../store/cartStore";
import { Trash2, Plus, Minus, ArrowLeft, CreditCard } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import api from "../../lib/axios";

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, clearCart } = useCartStore();

  const [isMounted, setIsMounted] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    // ĐÃ THÊM: Chốt chặn an toàn - Bắt buộc phải đăng nhập mới được vào trang này
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const totalPrice = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleCheckout = async () => {
    if (items.length === 0) {
      toast.error("Giỏ hàng trống, Sếp mua thêm đồ đi!");
      return;
    }

    setIsCheckingOut(true);

    try {
      console.log("🛒 Dữ liệu giỏ hàng chuẩn bị chốt:", items);

      const response = await api.post("/orders", {
        items: items.map((item: any) => ({
          id: item.variantId || item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        totalPrice: totalPrice,
      });

      const orderData = response.data?.data;

      if (!orderData || !orderData.id) {
        throw new Error("Không nhận được thông tin đơn hàng từ hệ thống!");
      }

      const paymentResponse = await api.get(`/orders/${orderData.id}/payment`);
      const paymentUrl = paymentResponse.data?.data?.paymentUrl;

      toast.success("Đang kết nối cổng thanh toán VNPAY...", { icon: "💳" });

      clearCart();

      if (paymentUrl) {
        window.location.assign(paymentUrl);
      } else {
        toast.error("Không khởi tạo được đường dẫn VNPAY, vui lòng thử lại!");
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        toast.error(
          "Sếp cần đăng nhập tài khoản trước khi tiến hành đặt hàng nhé!",
        );
      } else {
        toast.error(
          error.response?.data?.message ||
            "Có lỗi xảy ra trong quá trình xử lý đơn hàng!",
        );
      }
      console.error("Lỗi chốt đơn VNPAY:", error);
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center font-sans">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-4 border-gray-950 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-400 font-medium animate-pulse">
            Đang chuẩn bị giỏ hàng cho Sếp...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8 font-sans text-gray-800">
      <Toaster position="top-center" />

      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors group"
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Tiếp tục mua sắm
          </Link>
        </div>

        <h1 className="text-3xl font-black text-gray-950 tracking-tight mb-10">
          Giỏ hàng của Sếp
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)]">
            <div className="max-w-md mx-auto space-y-6">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-400">
                <Trash2 size={32} />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-gray-900">
                  Giỏ hàng đang trống
                </h2>
                <p className="text-gray-400 text-sm">
                  Chưa có sản phẩm nào được thêm vào giỏ. Sếp quay lại trang chủ
                  chọn đồ nhé!
                </p>
              </div>
              <Link
                href="/"
                className="inline-block bg-gray-950 hover:bg-black text-white px-6 py-3 rounded-xl text-sm font-bold shadow-md transition-all active:scale-[0.98]"
              >
                Khám phá sản phẩm ngay
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] flex items-center gap-4 sm:gap-6 transition-all hover:shadow-[0_10px_30px_rgba(0,0,0,0.04)]"
                >
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {item.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-4/5 h-4/5 object-contain"
                      />
                    ) : (
                      <span className="text-[10px] text-gray-400 font-bold uppercase text-center p-1">
                        No Img
                      </span>
                    )}
                  </div>

                  <div className="flex-grow min-w-0 space-y-1">
                    <h3 className="font-bold text-gray-900 text-base sm:text-lg truncate">
                      {item.name}
                    </h3>
                    <p className="text-gray-900 font-extrabold text-sm sm:text-base tracking-tight">
                      {formatPrice(item.price)}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4 flex-shrink-0">
                    <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 overflow-hidden">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        disabled={isCheckingOut}
                        className="p-2 sm:p-2.5 hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors disabled:opacity-50"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm font-bold text-gray-900 select-none">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        disabled={isCheckingOut}
                        className="p-2 sm:p-2.5 hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors disabled:opacity-50"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        removeFromCart(item.id);
                        toast.error(`Đã bỏ ${item.name} khỏi giỏ hàng`);
                      }}
                      disabled={isCheckingOut}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all disabled:opacity-50"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] space-y-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 pb-4 border-b border-gray-100">
                Tóm tắt đơn hàng
              </h2>

              <div className="space-y-4 text-sm font-medium">
                <div className="flex justify-between text-gray-400">
                  <span>Tạm tính</span>
                  <span className="text-gray-900 font-semibold">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Phí vận chuyển</span>
                  <span className="text-green-600 font-semibold">Miễn phí</span>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-between items-baseline">
                  <span className="text-base font-bold text-gray-900">
                    Tổng cộng
                  </span>
                  <span className="text-2xl font-black text-blue-600 tracking-tight">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isCheckingOut || items.length === 0}
                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-gray-100 transition-all ${
                  isCheckingOut || items.length === 0
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gray-950 hover:bg-black text-white hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]"
                }`}
              >
                {isCheckingOut ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <CreditCard size={18} />
                )}
                {isCheckingOut ? "Đang kết nối VNPAY..." : "Tiến hành đặt hàng"}
              </button>

              <p className="text-[11px] text-gray-400 text-center leading-relaxed">
                Đơn hàng được áp dụng chính sách bảo mật tối đa của{" "}
                <b>VIP STORE</b>.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
