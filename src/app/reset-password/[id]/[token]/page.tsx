"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "../../../../lib/axios";

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useParams(); // Lấy ID và Token từ trên thanh địa chỉ URL xuống

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (newPassword !== confirmPassword) {
      setError("Hai mật khẩu không khớp nhau!");
      return;
    }

    try {
      // Gọi API đổi mật khẩu, ghép id và token lấy từ params vào URL
      await api.post(`/auth/reset-password/${params.id}/${params.token}`, {
        newPassword,
      });

      setMessage(
        "Đổi mật khẩu thành công! Đang chuyển hướng về trang đăng nhập...",
      );

      // Chờ 2 giây cho người dùng đọc thông báo rồi đá về trang Login
      setTimeout(() => {
        router.push("/login");
      }, 2000);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Link đã hết hạn hoặc không hợp lệ. Vui lòng xin cấp lại link mới!",
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Tạo Mật Khẩu Mới
        </h2>

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

        <form onSubmit={handleReset} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu mới
            </label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Nhập mật khẩu mới"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nhập lại mật khẩu
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Xác nhận lại mật khẩu"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition-colors mt-2"
          >
            Lưu mật khẩu mới
          </button>
        </form>
      </div>
    </div>
  );
}
