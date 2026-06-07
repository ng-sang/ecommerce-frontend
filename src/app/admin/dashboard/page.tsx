"use client";

import AdminGuard from "../../../components/AdminGuard";
import { useEffect, useState } from "react";
import api from "../../../lib/axios";
import { DollarSign, Package, TrendingUp } from "lucide-react";

export default function DashboardPage() {
  return (
    <AdminGuard>
      <AdminDashboardContent />
    </AdminGuard>
  );
}

function AdminDashboardContent() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    // Sếp kiểm tra lại route này bên backend xem đã đúng chưa nhé
    api
      .get("/admin/dashboard")
      .then((res) => setStats(res.data.data))
      .catch((err) => console.error(err));
  }, []);

  if (!stats)
    return (
      <div className="p-8 text-gray-500 font-bold">
        Đang tải dữ liệu Dashboard...
      </div>
    );

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <h1 className="text-3xl font-black mb-8 text-gray-900">Dashboard</h1>

      {/* Các thẻ thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-xl">
            <Package size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-400">Tổng đơn hàng</p>
            <p className="text-2xl font-black text-gray-900">
              {stats.totalOrders || 0}
            </p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-green-50 text-green-600 rounded-xl">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-400">Doanh thu</p>
            <p className="text-2xl font-black text-gray-900">
              {formatPrice(stats.totalRevenue || 0)}
            </p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-purple-50 text-purple-600 rounded-xl">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-400">Tổng khách hàng</p>
            <p className="text-2xl font-black text-gray-900">
              {stats.totalCustomers || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Sếp có thể thêm phần danh sách đơn hàng ở đây nếu muốn */}
    </div>
  );
}
