import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { CustomerLayout } from '../layouts/CustomerLayout';
import { AdminLayout } from '../layouts/AdminLayout';
import { HomePage } from '../pages/public/HomePage';
import { LoginPage } from '../pages/public/LoginPage';
import { RegisterPage } from '../pages/public/RegisterPage';
import { ForgotPasswordPage } from '../pages/public/ForgotPasswordPage';
import { ProfilePage } from '../pages/customer/ProfilePage';
import { AddressesPage } from '../pages/customer/AddressesPage';
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Storefront Layout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Customer Account Routes */}
        <Route path="/customer" element={<CustomerLayout />}>
          <Route index element={<Navigate to="/customer/profile" replace />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="addresses" element={<AddressesPage />} />
          <Route path="orders" element={<div className="text-center py-12 text-gray-400">Order management will be active in Phase 4.</div>} />
          <Route path="wishlist" element={<div className="text-center py-12 text-gray-400">Saved Wishlist will be active in Phase 3.</div>} />
          <Route path="notifications" element={<div className="text-center py-12 text-gray-400">Notification center ready.</div>} />
        </Route>

        {/* Placeholder store routes */}
        <Route path="/shop" element={<div className="py-20 text-center text-gray-400">Catalog active in Phase 2 & 3.</div>} />
        <Route path="/categories/:slug" element={<div className="py-20 text-center text-gray-400">Category Catalog active in Phase 2.</div>} />
        <Route path="/collections" element={<div className="py-20 text-center text-gray-400">Collections active in Phase 2.</div>} />
        <Route path="/collections/:slug" element={<div className="py-20 text-center text-gray-400">Collection Lookbook active in Phase 2.</div>} />
        <Route path="/cart" element={<div className="py-20 text-center text-gray-400">Cart active in Phase 4.</div>} />
      </Route>

      {/* Protected Admin Executive Console */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="analytics" element={<div className="p-4 text-gray-300">Detailed analytics dashboard.</div>} />
        <Route path="orders" element={<div className="p-4 text-gray-300">Admin order management.</div>} />
        <Route path="products" element={<div className="p-4 text-gray-300">Catalog management.</div>} />
        <Route path="categories" element={<div className="p-4 text-gray-300">Category & brand taxonomy.</div>} />
        <Route path="inventory" element={<div className="p-4 text-gray-300">Stock & warehouse logistics.</div>} />
        <Route path="customers" element={<div className="p-4 text-gray-300">Customer directory.</div>} />
        <Route path="payments" element={<div className="p-4 text-gray-300">Transaction records.</div>} />
        <Route path="coupons" element={<div className="p-4 text-gray-300">Coupon campaigns.</div>} />
        <Route path="promotions" element={<div className="p-4 text-gray-300">Flash sales.</div>} />
        <Route path="returns" element={<div className="p-4 text-gray-300">Return requests.</div>} />
        <Route path="settings" element={<div className="p-4 text-gray-300">Platform settings.</div>} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
