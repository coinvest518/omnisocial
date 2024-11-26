// components/Sidebar.tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from "next/router";
import { motion } from 'framer-motion';
import { FaChevronDown, FaUser } from 'react-icons/fa';
import { useSession, signOut } from "next-auth/react";

export interface SidebarItem {
  label: string;
  url?: string;
  icon?: React.ReactNode;
  target?: string;
  submenu?: SidebarItem[];
}

interface Props {
  items: SidebarItem[];
  onShowPopup: () => void;
  onLogout: () => void;  // Logout handler
}

const Sidebar: React.FC<Props> = ({ items = [], onShowPopup }) => {
  const router = useRouter();
  const { data : session } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [credits, setCredits] = useState<number | null>(session?.user?.credits || null);

  useEffect(() => {
    const fetchCredits = async () => {
      if (session) {
        const response = await fetch('/api/profile');
        const data = await response.json();
        if (response.ok) {
          setCredits(data.credits);
        } else {
          console.error(data.message);
        }
      }
    };

    fetchCredits();
  }, [session]);



  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: '/' });
    // Redirect to login page after logout
  };

  return (
    <motion.aside
      initial={{ x: '-100%' }}
      animate={{ x: 0 }}
      exit={{ x: '-100%' }}
      transition={{ type: 'tween', duration: 0.3 }}
      className="bg-white min-h-screen w-64 fixed top-0 left-0 h-full border-r border-gray-200 shadow-xl"
    >
      {/* Logo Area */}
      <div className="flex flex-col items-center p-6 cursor-pointer" onClick={() => router.push('/')}>
        <div className="w-46 h-46 bg-white rounded-full flex items-center justify-center mb-2">
          <img src="/images/logo.svg" alt="Custom Logo" className="w-48 h-48" /> {/* Logo */}
        </div>
        <h1 className="text-lg font-normal text-gray-700">Open Source</h1>
        <h1 className="text-lg font-semibold text-gray-700 flex items-center">
          Omni <img src="/images/logo.svg" alt="Custom Logo" className="w-10 h-10 mx-1" /> Social
        </h1>
      </div>

      {/* User Info Section */}
      {session?.user&& (
        <div className="relative p-4 border-t border-b border-gray-200">
          <motion.button
            className="w-full flex items-center justify-between p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center">
              <FaUser className="text-gray-600 mr-2" />
              <div className="text-left overflow-hidden">
              <p className="font-semibold text-sm truncate">{session.user.email}</p>
              <p className="text-xs text-gray-500">Credits: {credits !== null ? credits : 'Loading...'}</p>
              </div>
            </div>
            <FaChevronDown className={`text-gray-600 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
          </motion.button>
          {isUserMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute left-0 right-0 mt-2 bg-white shadow-md rounded-md overflow-hidden z-10"
            >
               <button
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors duration-200"
                onClick={() => {
                  handleLogout(); // Call the logout function
                  setIsUserMenuOpen(false);
                }}
              >
                Logout
              </button>
            </motion.div>
          )}
        </div>
      )}

      <nav className="flex-1 px-4">
        <ul className="space-y-2">
          {items.map((item, index) => (
            <motion.li key={index} whileHover={{ x: 5 }} transition={{ type: 'spring', stiffness: 300 }}>
              {item.submenu ? (
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`flex items-center p-2 rounded-lg w-full text-left ${router.pathname === item.url ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    {item.icon}
                    <span className="ml-3">{item.label}</span>
                    <FaChevronDown className={`ml-auto transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isDropdownOpen && (
                    <ul className="absolute left-0 w-full bg-white shadow-md rounded-md mt-2 py-2">
                      {item.submenu.map((subItem, subIndex) => (
                        <li key={subIndex}>
                          <a
                            href={subItem.url}
                            target={subItem.target ? '_blank' : undefined}
                            className="block px-4 py-2 text-gray-600 hover:bg-gray-100"
                          >
                            {subItem.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <a
                  href={item.url}
                  target={item.target ? '_blank' : undefined}
                  className={`flex items-center p-2 rounded-lg ${router.pathname === item.url ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                </a>
              )}
            </motion.li>
          ))}
        </ul>
      </nav>

      <div className="p-4 space-y-4">
        <motion.button
          className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white px-6 py-3 rounded-full font-semibold shadow-md"
          onClick={() => router.push('/dashboard')}
          whileHover={{ scale: 1.05 }}
        >
          View Dashboard
        </motion.button>

        <motion.button
          className="w-full bg-gradient-to-r from-purple-400 to-pink-500 text-white px-6 py-3 rounded-full font-semibold shadow-md"
          onClick={onShowPopup}
          whileHover={{ scale: 1.05 }}
        >
          Go Pro
        </motion.button>

        <motion.button
          className="w-full bg-gradient-to-r from-blue-400 to-indigo-500 text-white px-6 py-3 rounded-full font-semibold shadow-md"
          onClick={() => router.push('/login')}
          whileHover={{ scale: 1.05 }}
        >
          Login
        </motion.button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
