"use client";
export const dynamic = "force-dynamic";
import { useCartStore } from "../store/cartStore";
import { useEffect, useState } from "react";
import api from "../lib/axios";
import { ShoppingCart } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

interface ProductVariant {
  id: string;
  price: number;
  color: string;
  ram: string;
  rom: string;
}

interface Product {
  id: string;
  name: string;
  image?: string;
  variants?: ProductVariant[];
}

const BACKEND_URL = "http://localhost:5000";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Trạng thái phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  const addToCart = useCartStore((state) => state.addToCart);
  const totalItems = useCartStore((state) => state.getTotalItems());
  const router = useRouter();

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      // Gọi API với tham số tìm kiếm và phân trang
      const response = await api.get(
        `/products?search=${searchQuery}&page=${currentPage}&limit=8`,
      );
      setProducts(response.data?.data || []);
      setTotalPages(response.data?.meta?.totalPages || 1);
    } catch (error) {
      console.error("Lỗi kết nối Backend:", error);
      toast.error("Không thể kết nối đến máy chủ sản phẩm!");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    setCurrentPage(1);
  }, [searchQuery]);

  useEffect(() => {
    fetchProducts();
  }, [searchQuery, currentPage]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleAddToCart = (
    product: Product,
    numericPrice: number,
    displayImage: string,
  ) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Sếp cần đăng nhập để thêm hàng vào giỏ nhé!");
      router.push("/login");
      return;
    }
    addToCart({
      id: product.id,
      name: product.name,
      price: numericPrice,
      image: displayImage,
      quantity: 1,
    });
    toast.success(`Đã thêm ${product.name} vào giỏ hàng!`);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 sm:p-10 font-sans text-gray-800">
      <Toaster position="top-center" />
      <div className="max-w-6xl mx-auto">
        <header className="mb-16 text-center pt-8">
          <h1 className="text-4xl sm:text-5xl font-black text-gray-950 mb-3">
            Cửa hàng Điện thoại VIP
          </h1>
          <div className="inline-flex items-center gap-2.5 bg-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-sm border border-gray-100">
            <ShoppingCart size={16} /> Giỏ hàng:{" "}
            <span className="text-blue-600 font-bold">
              {isMounted && isLoggedIn ? totalItems : 0}
            </span>{" "}
            món
          </div>
        </header>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="bg-white rounded-2xl p-5 border border-gray-100 animate-pulse h-64"
              />
            ))}
          </div>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-400">
            Không tìm thấy sản phẩm nào.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {products.map((product) => {
                const numericPrice = product.variants?.[0]?.price
                  ? Number(product.variants[0].price)
                  : 0;
                const displayImage = product.image
                  ? product.image.startsWith("http")
                    ? product.image
                    : `${BACKEND_URL}${product.image}`
                  : "";
                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex flex-col"
                  >
                    <Link href={`/product/${product.id}`} className="flex-1">
                      <div className="w-full aspect-square bg-gray-50 rounded-2xl mb-4 overflow-hidden">
                        <img
                          src={displayImage}
                          alt={product.name}
                          className="w-full h-full object-contain"
                          onError={(e) =>
                            (e.currentTarget.style.display = "none")
                          }
                        />
                      </div>
                      <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-gray-900 font-extrabold text-lg">
                        {numericPrice > 0
                          ? formatPrice(numericPrice)
                          : "Liên hệ"}
                      </p>
                    </Link>
                    <button
                      onClick={() =>
                        handleAddToCart(product, numericPrice, displayImage)
                      }
                      className="mt-4 w-full bg-gray-950 text-white py-3 rounded-xl font-bold"
                    >
                      Thêm vào giỏ
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Điều hướng phân trang */}
            <div className="flex justify-center items-center gap-4 mt-12">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-6 py-2 rounded-xl bg-white border border-gray-200 font-bold disabled:opacity-50"
              >
                Trước
              </button>
              <span className="font-bold">
                Trang {currentPage} / {totalPages}
              </span>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-6 py-2 rounded-xl bg-white border border-gray-200 font-bold disabled:opacity-50"
              >
                Sau
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
