"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Home,
  ShoppingBag,
} from "lucide-react";
import { Suspense } from "react";

// Tách Component con ra để dùng useSearchParams an toàn (chuẩn Next.js)
function PaymentResultContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");

  // Giao diện khi thanh toán THÀNH CÔNG
  if (status === "success") {
    return (
      <div className="max-w-lg w-full bg-white rounded-3xl p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={48} className="text-green-500" />
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">
          Thanh toán thành công!
        </h1>
        <p className="text-gray-500 mb-10 leading-relaxed">
          Cảm ơn Sếp đã mua sắm tại VIP STORE. Đơn hàng của Sếp đã được ghi nhận
          và đang trong quá trình chuẩn bị.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/orders"
            className="flex items-center justify-center gap-2 bg-gray-950 hover:bg-black text-white px-6 py-3.5 rounded-xl font-bold shadow-md transition-all active:scale-[0.98]"
          >
            <ShoppingBag size={18} />
            Xem đơn hàng
          </Link>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3.5 rounded-xl font-bold transition-all active:scale-[0.98]"
          >
            <Home size={18} />
            Về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  // Giao diện khi thanh toán THẤT BẠI (Khách hủy hoặc không đủ tiền)
  if (status === "failed") {
    return (
      <div className="max-w-lg w-full bg-white rounded-3xl p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle size={48} className="text-red-500" />
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">
          Giao dịch thất bại!
        </h1>
        <p className="text-gray-500 mb-10 leading-relaxed">
          Quá trình thanh toán qua VNPAY đã bị hủy hoặc xảy ra sự cố. Tiền của
          Sếp chưa bị trừ. Vui lòng thử đặt hàng lại nhé!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/cart"
            className="flex items-center justify-center gap-2 bg-gray-950 hover:bg-black text-white px-6 py-3.5 rounded-xl font-bold shadow-md transition-all active:scale-[0.98]"
          >
            <ShoppingBag size={18} />
            Quay lại giỏ hàng
          </Link>
        </div>
      </div>
    );
  }

  // Giao diện khi bị LỖI HỆ THỐNG (Sai chữ ký, lỗi kết nối...)
  return (
    <div className="max-w-lg w-full bg-white rounded-3xl p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 text-center animate-in fade-in zoom-in duration-500">
      <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <AlertTriangle size={48} className="text-orange-500" />
      </div>
      <h1 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">
        Lỗi xác thực VNPAY
      </h1>
      <p className="text-gray-500 mb-10 leading-relaxed">
        Hệ thống phát hiện chữ ký bảo mật không hợp lệ hoặc sự cố kết nối. Vui
        lòng liên hệ Admin để được hỗ trợ.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/"
          className="flex items-center justify-center gap-2 bg-gray-950 hover:bg-black text-white px-6 py-3.5 rounded-xl font-bold shadow-md transition-all active:scale-[0.98]"
        >
          <Home size={18} />
          Về trang chủ an toàn
        </Link>
      </div>
    </div>
  );
}

// Bọc Suspense ở Component cha theo chuẩn bắt buộc của Next.js
export default function PaymentResultPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <Suspense
        fallback={
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-gray-950 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 font-medium animate-pulse">
              Đang xác nhận kết quả...
            </p>
          </div>
        }
      >
        <PaymentResultContent />
      </Suspense>
    </div>
  );
}
