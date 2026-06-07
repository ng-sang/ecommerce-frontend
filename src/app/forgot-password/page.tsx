"use client";

import { useState } from "react";
import api from "../../lib/axios";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    try {
      // Gọi API gửi mail mà bạn đã làm ở Backend
      await api.post("/auth/forgot-password", { email });
      setMessage(
        "Tuyệt vời! Link khôi phục đã được gửi vào email của bạn. Vui lòng kiểm tra cả hộp thư rác (Spam) nhé.",
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Không thể gửi email. Vui lòng kiểm tra lại địa chỉ email!",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
          Quên Mật Khẩu
        </h2>
        <p className="text-gray-500 text-center mb-8 text-sm">
          Đừng lo lắng! Hãy nhập email bạn đã đăng ký, chúng tôi sẽ gửi cho bạn
          một đường link để đặt lại mật khẩu.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm text-center">
            {error}
          </div>
        )}
        {message && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm text-center font-medium">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email của bạn
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="admin@gmail.com"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full text-white font-medium py-3 rounded-xl transition-colors ${isLoading ? "bg-gray-400" : "bg-gray-900 hover:bg-gray-800"}`}
          >
            {isLoading ? "Đang gửi email..." : "Gửi link khôi phục"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-500 text-sm">
          Nhớ ra mật khẩu rồi?{" "}
          <Link
            href="/login"
            className="text-gray-900 font-semibold hover:underline"
          >
            Quay lại đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}
