import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store';
import AuthPage from '../../pages/AuthPage';

/**
 * ProtectedRoute
 * Bọc các route cần đăng nhập.
 * - Nếu chưa đăng nhập  → hiển thị AuthPage (hoặc redirect tùy mode)
 * - Nếu đã đăng nhập    → render children bình thường
 * - Nếu role không khớp → redirect về /home
 *
 * Props:
 *   children   — component con cần bảo vệ
 *   roles      — mảng role được phép, VD: ['admin', 'technician']
 *               (bỏ qua nếu không cần giới hạn role)
 *   redirectTo — đường dẫn redirect khi không có quyền (mặc định '/home')
 */
export default function ProtectedRoute({ children, roles = [], redirectTo = '/home' }) {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  // Chưa đăng nhập → hiện trang auth
  if (!isAuthenticated) {
    return <AuthPage />;
  }

  // Đã đăng nhập nhưng role không được phép
  if (roles.length > 0 && !roles.includes(user?.role)) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  return children;
}
