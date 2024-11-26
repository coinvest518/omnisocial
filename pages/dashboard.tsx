// pages/dashboard.tsx
import React from 'react';
import UserDashboard from '../components/DashBoard';
import Sidebar from '../components/Sidebar';
import Layout from '@/components/Layout';

const DashboardPage: React.FC = () => {

  const handleShowPopup = () => {
    // Handle showing a popup if needed
  };

  const handleLogout = () => {
    // Handle logout logic
  };

  const sidebarItems = [
    
    { label: 'Dashboard', url: '/dashboard' },
    { label: "Templates", url: "/" },
    // Add more sidebar items as needed
  ];

  return (
    <Layout title="" onLogout={handleLogout}> {/* Wrap with Layout */}

   
      <Sidebar 
        items={sidebarItems} 
        onShowPopup={handleShowPopup} 
        onLogout={handleLogout} 
      />
        <UserDashboard />
    </Layout>
  );
};

export default DashboardPage;