"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "../../../store/cartStore";
import api from "../../../lib/axios";
import {
  ShoppingCart,
  ArrowLeft,
  Check,
  ShieldCheck,
  Truck,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation"; // ĐÃ THÊM useRouter

const BACKEND_URL = "http://localhost:5000";

interface ProductVariant {
  id: string;
  color: string;
  price: number | string;
  ram: string;
  rom: string;
  stock: number;
}

interface Product {
  id: string;
  name: string;
  description: string;
  image?: string;
  brand?: { name: string };
  category?: { name: string };
  variants: ProductVariant[];
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter(); // ĐÃ THÊM
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`/products/${productId}`);
        const data = response.data?.data || response.data;

        setProduct(data);

        if (data.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants[0]);
        }
      } catch (error) {
        console.error("Lỗi lấy chi tiết sản phẩm:", error);
        toast.error("Không tìm thấy thông tin sản phẩm!");
      } finally {
        setIsLoading(false);
      }
    };

    if (productId) {
      fetchProductDetail();
    }
  }, [productId]);

  const formatPrice = (price: number | string) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(Number(price));
  };

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;

    // ĐÃ THÊM: CHỐT CHẶN KIỂM TRA ĐĂNG NHẬP TẠI TRANG CHI TIẾT
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Sếp cần đăng nhập để thêm hàng vào giỏ nhé!");
      router.push("/login");
      return;
    }

    const numericPrice = Number(selectedVariant.price) || 0;
    const displayImage = product.image?.startsWith("http")
      ? product.image
      : `${BACKEND_URL}${product.image}`;

    addToCart({
      id: selectedVariant.id,
      name: `${product.name} (${selectedVariant.color} - ${selectedVariant.ram}/${selectedVariant.rom})`,
      price: numericPrice,
      image: displayImage,
    });

    toast.success(`Đã thêm ${product.name} vào giỏ hàng!`, {
      style: {
        border: "1px solid #f3f4f6",
        padding: "16px",
        color: "#1f2937",
        borderRadius: "16px",
        background: "#ffffff",
        boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
      },
      iconTheme: { primary: "#111827", secondary: "#ffffff" },
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-950 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">
          Sản phẩm không tồn tại
        </h2>
        <Link href="/" className="text-blue-600 hover:underline font-medium">
          Quay lại cửa hàng
        </Link>
      </div>
    );
  }

  const displayImage = product.image?.startsWith("http")
    ? product.image
    : `${BACKEND_URL}${product.image}`;
  const currentPrice = selectedVariant ? Number(selectedVariant.price) : 0;

  return (
    <div className="min-h-screen bg-white py-10 px-4 sm:px-6 lg:px-8 font-sans text-gray-900">
      <Toaster position="top-center" />

      <div className="max-w-6xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors mb-10 group"
        >
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Trở về cửa hàng
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <div className="bg-gray-50/50 rounded-3xl border border-gray-100 p-8 flex items-center justify-center aspect-square relative">
            {displayImage ? (
              <img
                src={displayImage}
                alt={product.name}
                className="w-4/5 h-4/5 object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            ) : (
              <span className="text-gray-400 font-bold uppercase tracking-widest text-sm">
                Chưa có ảnh thật
              </span>
            )}

            {product.brand?.name ? (
              <div className="absolute top-6 left-6 bg-white px-4 py-2 rounded-xl text-xs font-black tracking-widest uppercase border border-gray-200 shadow-sm">
                {product.brand.name}
              </div>
            ) : null}
          </div>

          <div className="flex flex-col justify-center">
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-gray-950 mb-4 leading-tight">
              {product.name}
            </h1>

            <p className="text-3xl font-extrabold text-blue-600 tracking-tight mb-8">
              {currentPrice > 0 ? formatPrice(currentPrice) : "Liên hệ"}
            </p>

            {product.description && (
              <p className="text-gray-500 text-base leading-relaxed mb-8">
                {product.description}
              </p>
            )}

            <hr className="border-gray-100 mb-8" />

            {product.variants && product.variants.length > 0 && (
              <div className="mb-10">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4">
                  Chọn phiên bản
                </h3>
                <div className="flex flex-wrap gap-3">
                  {product.variants.map((variant) => {
                    const isSelected = selectedVariant?.id === variant.id;
                    return (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant)}
                        className={`relative px-5 py-3 rounded-2xl text-sm font-bold border-2 transition-all duration-200 flex items-center gap-2
                          ${
                            isSelected
                              ? "border-gray-900 bg-gray-900 text-white shadow-lg shadow-gray-200"
                              : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                          }
                        `}
                      >
                        {isSelected && <Check size={16} />}
                        {variant.color} - {variant.ram}/{variant.rom}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <button
              onClick={handleAddToCart}
              disabled={!selectedVariant || selectedVariant.stock === 0}
              className={`w-full py-4.5 rounded-2xl text-lg font-black tracking-wide flex items-center justify-center gap-3 transition-all active:scale-[0.98] ${
                !selectedVariant || selectedVariant.stock === 0
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gray-950 hover:bg-black text-white shadow-xl shadow-gray-200 hover:-translate-y-1"
              }`}
            >
              <ShoppingCart size={22} />
              {selectedVariant?.stock === 0 ? "Tạm hết hàng" : "Thêm vào giỏ"}
            </button>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 text-sm font-semibold text-gray-600 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <ShieldCheck size={20} className="text-green-500" />
                Bảo hành chính hãng
              </div>
              <div className="flex items-center gap-3 text-sm font-semibold text-gray-600 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <Truck size={20} className="text-blue-500" />
                Giao hàng siêu tốc
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
