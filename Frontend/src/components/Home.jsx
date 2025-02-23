import React, { useState } from 'react';
import Dashboard from './Dashboard';
import Category from './Category';
import Subcategory from './Subcategory';
import Products from './Products';
import { TablesprintState } from '../contexts/TablesprintContext';
import { useToast } from '@chakra-ui/react';

const Home = () => {
  const { logout } = TablesprintState();
  const [activeComponent, setActiveComponent] = useState('dashboard');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const toast = useToast();

  const renderComponent = () => {
    switch (activeComponent) {
      case 'dashboard':
        return <Dashboard />;
      case 'category':
        return <Category />;
      case 'subcategory':
        return <Subcategory />;
      case 'products':
        return <Products />;
      default:
        return <Dashboard />;
    }
  };

  const handleLogoutConfirm = () => {
    logout();
    setShowLogoutModal(false);
    toast({
      title: 'Logged out',
      description: 'You have successfully logged out.',
      status: 'success',
      duration: 3000,
      isClosable: true,
      position: 'top',
    });
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100 overflow-hidden">
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-purple-700 to-indigo-600 text-white py-3 px-5 flex justify-between items-center shadow-md">
        <img src="./tablesprint_logo.png" alt="logo" className="h-10 animate-pulse" />
        <button onClick={() => setShowLogoutModal(true)} className="hover:scale-110 transition-transform">
          <i className="bi bi-person text-2xl"></i>
        </button>
      </nav>

      {/* Main Layout */}
      <div className="flex flex-grow overflow-hidden">
        {/* Sidebar */}
        <aside className="w-1/5 bg-gray-800 text-white p-5 h-full shadow-lg flex flex-col space-y-3">
          {['dashboard', 'category', 'subcategory', 'products'].map((item) => (
            <button
              key={item}
              onClick={() => setActiveComponent(item)}
              className={`px-4 py-3 rounded-lg flex items-center space-x-3 transition-all duration-300 ${activeComponent === item ? 'bg-purple-600 text-white font-bold shadow-md' : 'hover:bg-purple-500'
                }`}
            >
              <i className={`bi bi-${item === 'dashboard' ? 'house-door' : item === 'category' ? 'grid' : item === 'subcategory' ? 'list' : 'box'}`}></i>
              <span className="capitalize">{item}</span>
            </button>
          ))}
        </aside>

        {/* Main Content */}
        <main className="flex-grow p-6 bg-white shadow-lg rounded-lg overflow-auto">
          {renderComponent()}
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg text-center shadow-xl w-96">
            <i className="bi bi-exclamation-triangle-fill text-red-500 text-3xl"></i>
            <h4 className="text-lg font-bold mt-3">Log Out</h4>
            <p className="text-gray-600">Are you sure you want to log out?</p>
            <div className="flex justify-center mt-4 space-x-2">
              <button
                className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-200"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800"
                onClick={handleLogoutConfirm}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
