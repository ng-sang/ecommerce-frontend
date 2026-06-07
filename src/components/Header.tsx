"use client";

import Link from "next/link";
import {
  ShoppingCart,
  Smartphone,
  LogOut,
  LayoutDashboard,
  Package,
  Search,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCartStore } from "../store/cartStore";
import { useUserStore } from "../store/userStore";

export default function Header() {
  const { user, fetchUser, logout } = useUserStore();
  const cartCount = useCartStore((state) => state.getTotalItems());
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // State để giữ giá trị ô tìm kiếm
  const [search, setSearch] = useState(searchParams.get("search") || "");

  useEffect(() => {
    // eslint-disable-next-line
    setIsMounted(true);
    fetchUser();
  }, [fetchUser]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/?search=${search}`);
    } else {
      router.push(`/`);
    }
  };

  return (
    <header className="w-full bg-white border-b border-gray-100 py-4 px-8 flex justify-between items-center sticky top-0 z-50">
      <Link href="/" className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center text-white shadow-sm">
          <Smartphone size={18} />
        </div>
        <span className="font-black text-xl text-gray-900 tracking-tight">
          STORE
        </span>
      </Link>

      {/* THANH TÌM KIẾM MỚI */}
      <form
        onSubmit={handleSearch}
        className="flex items-center bg-gray-50 rounded-xl px-4 py-2 border border-gray-100 w-full max-w-sm mx-4"
      >
        <Search size={18} className="text-gray-400" />
        <input
          type="text"
          placeholder="Tìm sản phẩm..."
          className="bg-transparent border-none outline-none ml-2 w-full text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </form>

      <div className="flex items-center gap-6">
        <Link
          href={user ? "/cart" : "/login"}
          className="relative text-gray-400 hover:text-gray-900 transition-colors"
        >
          <ShoppingCart size={22} />
          {isMounted && user && cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
              {cartCount}
            </span>
          )}
        </Link>

        {user ? (
          <div className="flex items-center gap-5 border-l border-gray-200 pl-6">
            <div className="flex flex-col items-end mr-2">
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                Sếp đang online
              </span>
              <span className="text-sm font-bold text-gray-900">
                {user.fullName}
              </span>
            </div>

            {user.role === "ADMIN" && (
              <>
                <Link
                  href="/admin/dashboard"
                  className="text-gray-400 hover:text-blue-600 p-1"
                >
                  <LayoutDashboard size={20} />
                </Link>
                <Link
                  href="/admin/products"
                  className="text-gray-400 hover:text-purple-600 p-1"
                >
                  <Package size={20} />
                </Link>
              </>
            )}

            <button
              onClick={logout}
              className="text-gray-400 hover:text-red-500 p-1"
            >
              <LogOut size={20} />
            </button>
          </div>
        ) : (
          /* ĐÃ SỬA: Thêm nút Đăng ký vào Header khi chưa đăng nhập */
          <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
            <Link
              href="/login"
              className="text-sm font-bold bg-gray-900 text-white px-4 py-2 rounded-xl hover:bg-black transition-all"
            >
              Đăng nhập
            </Link>
            <Link
              href="/register"
              className="text-sm font-bold bg-gray-900 text-white px-4 py-2 rounded-xl hover:bg-black transition-all"
            >
              Đăng ký
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
