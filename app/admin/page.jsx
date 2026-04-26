'use client';

import { useState } from 'react';
import Sidebar from '@/components/admin/Sidebar';
import DashboardHome from '@/components/admin/tabs/DashboardHome';
import ProductsTab from '@/components/admin/tabs/ProductsTab';
import SalesTab from '@/components/admin/tabs/SalesTab';
import InventoryTab from '@/components/admin/tabs/InventoryTab';
import UsersTab from '@/components/admin/tabs/UsersTab';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'products':
        return <ProductsTab />;
      case 'sales':
        return <SalesTab />;
      case 'inventory':
        return <InventoryTab />;
      case 'users':
        return <UsersTab />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div className="h-screen flex bg-gray-100">

      {/* SIDEBAR */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* CONTENT */}
      <div className="flex-1 p-6 overflow-auto">
        {renderContent()}
      </div>

    </div>
  );
}