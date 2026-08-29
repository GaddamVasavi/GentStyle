import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { CustomerLayout } from '../layouts/CustomerLayout';
import { AdminLayout } from '../layouts/AdminLayout';
import { HomePage } from '../pages/public/HomePage';
import { LoginPage } from '../pages/public/LoginPage';
import { RegisterPage } from '../pages/public/RegisterPage';
import { ForgotPasswordPage } from '../pages/public/ForgotPasswordPage';
import { ShopPage } from '../pages/public/ShopPage';
import { ProductDetailsPage } from '../pages/public/ProductDetailsPage';
import { CategoriesPage } from '../pages/public/CategoriesPage';
import { CollectionsPage } from '../pages/public/CollectionsPage';
import { CartPage } from '../pages/public/CartPage';
import { CheckoutPage } from '../pages/public/CheckoutPage';
import { ProfilePage } from '../pages/customer/ProfilePage';
import { AddressesPage } from '../pages/customer/AddressesPage';
import { WishlistPage } from '../pages/customer/WishlistPage';
import { OrdersPage } from '../pages/customer/OrdersPage';
import { OrderDetailsPage } from '../pages/customer/OrderDetailsPage';
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { BespokeCustomizerPage } from '../pages/bespoke/BespokeCustomizerPage';
import { MeasurementStudioPage } from '../pages/bespoke/MeasurementStudioPage';
import { TailorFittingBookingPage } from '../pages/bespoke/TailorFittingBookingPage';
import { WarehouseInventoryPage } from '../pages/admin/WarehouseInventoryPage';
import { PurchaseOrdersPage } from '../pages/admin/PurchaseOrdersPage';
import { SupplierScorecardsPage } from '../pages/admin/SupplierScorecardsPage';
import { LogisticsCarrierPage } from '../pages/admin/LogisticsCarrierPage';
import { VIPClubPortalPage } from '../pages/customer/VIPClubPortalPage';
import { AIStylistPage } from '../pages/customer/AIStylistPage';
import { ExecutiveAnalyticsPage } from '../pages/admin/ExecutiveAnalyticsPage';
import { Customer360Page } from '../pages/admin/Customer360Page';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Storefront Layout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/products/:slug" element={<ProductDetailsPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/categories/:slug" element={<ShopPage />} />
        <Route path="/collections" element={<CollectionsPage />} />
        <Route path="/collections/:slug" element={<ShopPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/bespoke" element={<BespokeCustomizerPage />} />
        <Route path="/bespoke/measurements" element={<MeasurementStudioPage />} />
        <Route path="/bespoke/appointments" element={<TailorFittingBookingPage />} />
        <Route path="/vip-club" element={<VIPClubPortalPage />} />
        <Route path="/ai-stylist" element={<AIStylistPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Customer Account Routes */}
        <Route path="/customer" element={<CustomerLayout />}>
          <Route index element={<Navigate to="/customer/profile" replace />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="addresses" element={<AddressesPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="orders/:id" element={<OrderDetailsPage />} />
          <Route path="vip-concierge" element={<VIPClubPortalPage />} />
          <Route path="ai-wardrobe" element={<AIStylistPage />} />
          <Route path="notifications" element={<div className="text-center py-12 text-gray-400">Notification center ready.</div>} />
        </Route>
      </Route>

      {/* Protected Admin Executive Console */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="analytics" element={<ExecutiveAnalyticsPage />} />
        <Route path="orders" element={<div className="p-4 text-gray-300">Admin order management.</div>} />
        <Route path="products" element={<div className="p-4 text-gray-300">Catalog management.</div>} />
        <Route path="categories" element={<div className="p-4 text-gray-300">Category & brand taxonomy.</div>} />
        <Route path="inventory" element={<WarehouseInventoryPage />} />
        <Route path="procurement" element={<PurchaseOrdersPage />} />
        <Route path="suppliers" element={<SupplierScorecardsPage />} />
        <Route path="logistics" element={<LogisticsCarrierPage />} />
        <Route path="customers" element={<Customer360Page />} />
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
