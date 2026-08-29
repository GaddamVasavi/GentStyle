import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { AuthModal } from '../components/auth/AuthModal';
import { CartDrawer } from '../components/cart/CartDrawer';

export const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gentblack text-gray-100 font-sans selection:bg-gold-500 selection:text-gentblack">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <AuthModal />
      <CartDrawer />
    </div>
  );
};
