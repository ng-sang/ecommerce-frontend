"use client";

import { useUserStore } from "../store/userStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, fetchUser } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Nếu đã load xong user mà không có user hoặc role không phải ADMIN -> Đá về trang chủ
  if (user !== null && user.role !== "ADMIN") {
    router.push("/");
    return null;
  }

  // Nếu đang loading user
  if (!user) return <div>Đang xác thực...</div>;

  return <>{children}</>;
}
