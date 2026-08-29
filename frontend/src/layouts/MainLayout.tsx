import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { AuthModal } from '../components/auth/AuthModal';

export const MainLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#0b0d10] text-[#f5f0e9]">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <AuthModal />
    </div>
  );
};
