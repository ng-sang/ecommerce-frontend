"use client";

import { useState } from "react";
import Link from "next/link";
import { LogIn, Eye, EyeOff } from "lucide-react";
import api from "../../lib/axios";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });

      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userEmail", email); // Lưu email để phân biệt giỏ hàng

        if (res.data.user?.fullName) {
          localStorage.setItem("userName", res.data.user.fullName);
        }
      }

      alert("Đăng nhập thành công!");
      window.location.href = "/";
    } catch (err: any) {
      alert(
        err.response?.data?.message ||
          "Đăng nhập thất bại! Kiểm tra lại thông tin.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col items-center">
        <div className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center text-white mb-6 shadow-md">
          <LogIn size={28} />
        </div>

        <h2 className="text-2xl font-black text-gray-900 mb-2">
          Chào Sếp quay lại!
        </h2>
        <p className="text-sm text-gray-500 mb-8 text-center">
          Đăng nhập để tiếp tục mua sắm tại VIP Store
        </p>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <div>
            <input
              type="email"
              required
              placeholder="admin@gmail.com"
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-gray-900 transition-all text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              placeholder="••••••••"
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-gray-900 transition-all text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full p-4 rounded-xl font-bold text-white bg-gray-900 hover:bg-black transition-all mt-2"
          >
            {isLoading ? "Đang xử lý..." : "Vào cửa hàng ngay"}
          </button>

          {/* ĐÃ SỬA: Thêm phần Đăng ký và Quên mật khẩu ở đây */}
          <div className="mt-4 text-center text-sm">
            <Link
              href="/forgot-password"
              className="text-blue-500 hover:underline block mb-2"
            >
              Quên mật khẩu?
            </Link>
            <span className="text-gray-600">Chưa có tài khoản? </span>
            <Link
              href="/register"
              className="text-blue-500 hover:underline font-bold"
            >
              Đăng ký ngay
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
