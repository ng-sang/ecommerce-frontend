"use client";

import { useEffect, useState, useRef } from "react";
import api from "../../../lib/axios";
import {
  Trash2,
  Edit,
  Plus,
  Box,
  Image as ImageIcon,
  UploadCloud,
  X,
} from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [brandId, setBrandId] = useState("");
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("10");
  const [color, setColor] = useState("");
  const [ram, setRam] = useState("");
  const [rom, setRom] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. KHAI BÁO HÀM TRƯỚC
  const fetchProducts = async () => {
    try {
      const res = await api.get("/admin/products");
      setProducts(res.data.data || []);
    } catch (err) {
      console.error("Lỗi lấy sản phẩm:", err);
    }
  };

  // 2. GỌI HÀM VÀ FETCH DỮ LIỆU KHI LOAD TRANG (Chỉ cần 1 cái useEffect là đủ)
  useEffect(() => {
    // eslint-disable-next-line
    fetchProducts();

    // Gọi danh sách thương hiệu
    api
      .get("/brands")
      .then((res) => setBrands(res.data.data))
      .catch(console.error);

    // Gọi danh sách danh mục
    api
      .get("/categories")
      .then((res) => setCategories(res.data.data))
      .catch(console.error);
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getImageUrl = (path: any) => {
    if (!path || typeof path !== "string") return "";
    if (path.startsWith("http")) return path;

    const cleanPath = path.replace(/\\/g, "/");
    const formattedPath = cleanPath.startsWith("/")
      ? cleanPath
      : `/${cleanPath}`;

    return `http://localhost:5000${formattedPath}`;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Toàn bộ Response định dạng JSON:", res.data);

      // 🛠 ĐÃ FIX: Bóc tách chính xác dựa trên log thực tế của Backend Sếp gửi
      let uploadedUrl = "";

      if (res.data?.data?.imageUrl) {
        uploadedUrl = res.data.data.imageUrl; // Trường hợp của Sếp rơi vào đây!
      } else if (typeof res.data?.data === "string") {
        uploadedUrl = res.data.data;
      } else if (res.data?.imageUrl) {
        uploadedUrl = res.data.imageUrl;
      } else if (res.data?.url) {
        uploadedUrl = res.data.url;
      } else if (typeof res.data === "string") {
        uploadedUrl = res.data;
      }

      console.log(
        "👉 Đường dẫn CHUẨN ĐÃ BÓC TÁCH để lưu vào State:",
        uploadedUrl,
      );

      if (uploadedUrl && typeof uploadedUrl === "string") {
        setImage(uploadedUrl);
      } else {
        alert(
          "Upload thành công nhưng không lấy được link. Vui lòng báo Dev kiểm tra cấu trúc API!",
        );
      } // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      alert("Tải ảnh thất bại!");
      console.error("LỖI API UPLOAD:", err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEditClick = (product: any) => {
    setEditingId(product.id);
    setName(product.name);
    setBrandId(product.brandId || "");
    setCategoryId(product.categoryId || "");
    // Nếu db lỡ lưu object (do lỗi trước đó), hàm này bóc ra luôn để khỏi lỗi khi sửa
    let img = product.image;
    if (typeof img === "object" && img?.imageUrl) img = img.imageUrl;
    setImage(img || "");

    if (product.variants && product.variants.length > 0) {
      const v = product.variants[0];
      setPrice(v.price.toString());
      setStock(v.stock.toString());
      setColor(v.color || "");
      setRam(v.ram || "");
      setRom(v.rom || "");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setName("");
    setImage("");
    setPrice("");
    setStock("10");
    setColor("");
    setRam("");
    setRom("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      name,
      brandId: brandId,
      description: "Mô tả sản phẩm",
      image: typeof image === "string" ? image : "",
      variants: [
        {
          ram: ram || "8GB",
          rom: rom || "256GB",
          color: color || "Mặc định",
          price: Number(price),
          stock: Number(stock),
        },
      ],
    };

    try {
      if (editingId) {
        await api.put(`/admin/products/${editingId}`, payload);
        alert("Cập nhật thành công!");
      } else {
        await api.post("/admin/products", payload);
        alert("Thêm sản phẩm thành công!");
      }
      cancelEdit();
      fetchProducts(); // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      alert(err.response?.data?.message || "Thao tác thất bại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Sếp chắc chắn muốn xóa sản phẩm này?")) {
      try {
        await api.delete(`/admin/products/${id}`);
        fetchProducts();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        alert(
          "Lỗi: " + (err.response?.data?.message || "Không thể xóa sản phẩm!"),
        );
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <h1 className="text-3xl font-black mb-8 text-gray-900">
        Quản lý kho hàng
      </h1>

      <form
        onSubmit={handleSubmit}
        className={`p-6 rounded-2xl shadow-sm border mb-8 transition-all ${editingId ? "bg-blue-50 border-blue-200" : "bg-white border-gray-100"}`}
      >
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h2
            className={`text-lg font-bold ${editingId ? "text-blue-700" : "text-gray-800"}`}
          >
            {editingId ? "Sửa Sản Phẩm" : "Thêm Sản Phẩm Mới"}
          </h2>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="text-red-500 hover:bg-red-100 p-2 rounded-lg flex items-center gap-1 text-sm font-bold"
            >
              <X size={16} /> Hủy sửa
            </button>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/4 flex flex-col gap-2">
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-4 overflow-hidden relative group cursor-pointer transition-all h-44 ${isUploading ? "border-blue-400 bg-blue-100" : editingId ? "bg-white border-blue-300" : "bg-gray-50 border-gray-300 hover:border-gray-900"}`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="hidden"
                accept="image/*"
              />
              {isUploading ? (
                <span className="text-blue-500 font-bold animate-pulse">
                  Đang tải ảnh...
                </span>
              ) : image ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getImageUrl(image)}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-xl"
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onError={(e: any) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://placehold.co/150x150/png?text=No+Image";
                    }}
                  />
                </>
              ) : (
                <div className="text-gray-400 flex flex-col items-center py-6">
                  <UploadCloud size={48} className="mb-3 opacity-50" />
                  <span className="text-sm font-medium text-center">
                    Bấm vào đây để
                    <br />
                    tải ảnh từ máy tính
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="w-full md:w-3/4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-3">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                Tên sản phẩm
              </label>

              <input
                className="w-full p-3 border rounded-xl outline-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <div className="md:col-span-3 grid grid-cols-2 gap-4">
                {/* Ô CHỌN THƯƠNG HIỆU */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                    Thương hiệu
                  </label>
                  <select
                    className="w-full p-3 border rounded-xl outline-none"
                    value={brandId}
                    onChange={(e) => setBrandId(e.target.value)}
                    required
                  >
                    <option value="">-- Chọn thương hiệu --</option>
                    {brands.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Ô CHỌN DANH MỤC */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                    Danh mục
                  </label>
                  <select
                    className="w-full p-3 border rounded-xl outline-none"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    required
                  >
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                Giá (VNĐ)
              </label>
              <input
                className="w-full p-3 border rounded-xl outline-none"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                Màu sắc
              </label>
              <input
                className="w-full p-3 border rounded-xl outline-none"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                Số lượng (Kho)
              </label>
              <input
                className="w-full p-3 border rounded-xl outline-none"
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                RAM
              </label>
              <input
                className="w-full p-3 border rounded-xl outline-none"
                value={ram}
                onChange={(e) => setRam(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                ROM (Bộ nhớ)
              </label>
              <input
                className="w-full p-3 border rounded-xl outline-none"
                value={rom}
                onChange={(e) => setRom(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${isSubmitting ? "bg-gray-400" : editingId ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-gray-900 hover:bg-black text-white"}`}
              >
                {editingId
                  ? isSubmitting
                    ? "Đang cập nhật..."
                    : "Lưu Cập Nhật"
                  : isSubmitting
                    ? "Đang xử lý..."
                    : "Thêm Sản Phẩm"}
              </button>
            </div>
          </div>
        </div>
      </form>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 overflow-x-auto">
        <table className="w-full text-left min-w-[800px]">
          <thead>
            <tr className="border-b text-xs text-gray-400 uppercase tracking-wider">
              <th className="pb-4 font-bold">Sản phẩm</th>
              <th className="pb-4 font-bold">Màu sắc</th>
              <th className="pb-4 font-bold">Cấu hình</th>
              <th className="pb-4 font-bold">Kho</th>
              <th className="pb-4 font-bold">Giá</th>
              <th className="pb-4 font-bold text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p: any) => (
              <tr
                key={p.id}
                className="border-b last:border-0 hover:bg-gray-50"
              >
                <td className="py-4 font-bold flex items-center gap-4">
                  <div className="w-14 h-14 bg-gray-100 rounded-xl overflow-hidden border flex items-center justify-center">
                    {p.image ? (
                      <img
                        src={getImageUrl(p.image)}
                        className="w-full h-full object-cover"
                        onError={(e: any) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://placehold.co/150x150/png?text=No+Image";
                        }}
                      />
                    ) : (
                      <Box size={20} className="text-gray-400" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-900 text-base">{p.name}</span>
                  </div>
                </td>
                <td className="py-4 text-sm">
                  {p.variants?.[0]?.color || "N/A"}
                </td>
                <td className="py-4 text-sm">
                  {p.variants?.[0]
                    ? `${p.variants[0].ram} / ${p.variants[0].rom}`
                    : "N/A"}
                </td>
                <td className="py-4 text-sm">
                  <span
                    className={`px-2 py-1 rounded-md font-semibold ${p.variants?.[0]?.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                  >
                    {p.variants?.[0]?.stock || 0}
                  </span>
                </td>
                <td className="py-4 font-bold text-blue-600">
                  {p.variants?.[0]?.price
                    ? p.variants[0].price.toLocaleString() + " ₫"
                    : "Chưa có giá"}
                </td>
                <td className="py-4 text-right flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => handleEditClick(p)}
                    className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg"
                    title="Sửa"
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(p.id)}
                    className="text-red-500 hover:bg-red-50 p-2 rounded-lg"
                    title="Xóa"
                  >
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
