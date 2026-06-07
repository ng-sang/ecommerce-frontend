"use client";

import { useEffect, useState } from "react";
import api from "../../lib/axios";
import { DollarSign, Package, TrendingUp, AlertTriangle } from "lucide-react";

export default function AdminDashboard() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    // Gọi đúng route /admin/dashboard đã khai báo trong router
    api.get("/admin/dashboard").then((res) => setStats(res.data.data));
  }, []);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  if (!stats)
    return (
      <div className="min-h-screen flex items-center justify-center font-bold text-gray-400">
        Đang tải dữ liệu Dashboard...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <h1 className="text-3xl font-black mb-8 text-gray-900">
        Admin Dashboard
      </h1>

      {/* Thẻ thống kê tổng quan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-xl">
            <Package size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-400">Tổng đơn hàng</p>
            <p className="text-2xl font-black text-gray-900">
              {stats.totalOrders}
            </p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-green-50 text-green-600 rounded-xl">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-400">Doanh thu (PAID)</p>
            <p className="text-2xl font-black text-gray-900">
              {formatPrice(stats.totalRevenue)}
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
              {stats.totalCustomers}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Bảng đơn hàng gần đây */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold mb-4">Đơn hàng gần đây</h2>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b text-sm text-gray-400">
                <th className="pb-3">Mã đơn</th>
                <th className="pb-3">Khách hàng</th>
                <th className="pb-3">Tổng tiền</th>
                <th className="pb-3">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.map((order: any) => (
                <tr
                  key={order.id}
                  className="border-b last:border-0 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 font-bold text-sm">
                    #{order.id.slice(-6)}
                  </td>
                  <td className="py-4 text-sm">
                    {order.user?.fullName || "Khách lạ"}
                  </td>
                  <td className="py-4 font-semibold text-sm">
                    {formatPrice(order.totalPrice)}
                  </td>
                  <td className="py-4">
                    <span
                      className={`px-2 py-1 rounded text-[10px] font-bold ${
                        order.status === "PAID"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Cảnh báo tồn kho */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <AlertTriangle className="text-orange-500" size={20} />
            Hàng sắp hết
          </h2>
          <div className="space-y-4">
            {stats.lowStockAlerts.map((item: any) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl"
              >
                <img
                  src={item.product.image}
                  className="w-10 h-10 rounded-lg object-cover"
                />
                <div>
                  <p className="text-xs font-bold text-gray-900">
                    {item.product.name}
                  </p>
                  <p className="text-[10px] text-orange-600 font-bold">
                    Còn {item.stock} cái
                  </p>
                </div>
              </div>
            ))}
            {stats.lowStockAlerts.length === 0 && (
              <p className="text-sm text-gray-400 italic">
                Tồn kho đang rất tốt!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
