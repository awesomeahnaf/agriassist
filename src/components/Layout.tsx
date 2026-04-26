/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PlusCircle, 
  History, 
  UserCircle, 
  LogOut, 
  Menu, 
  X,
  Sprout,
  UserCheck,
  Stethoscope
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserRole } from '../types';
import { useAuth } from '../context/AuthContext';

export default function Layout({ children, role }: { children: React.ReactNode; role: UserRole }) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const farmerLinks = [
    { to: '/farmer', label: 'ড্যাশবোর্ড', icon: LayoutDashboard },
    { to: '/farmer/submit', label: 'সমস্যা জমা দিন', icon: PlusCircle },
    { to: '/farmer/tracking', label: 'সমস্যার অবস্থা', icon: History },
  ];

  const officerLinks = [
    { to: '/officer', label: 'ফিল্ড অফিসার ড্যাশবোর্ড', icon: UserCheck },
  ];

  const expertLinks = [
    { to: '/expert', label: 'বিশেষজ্ঞ ড্যাশবোর্ড', icon: Stethoscope },
  ];

  const links = role === 'farmer' ? farmerLinks : role === 'field_officer' ? officerLinks : expertLinks;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bangla-text">
      {/* Navbar */}
      <nav className="bg-primary text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 rounded-md hover:bg-primary-dark transition-colors"
              >
                {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <Link to="/" className="flex items-center gap-2 font-bold text-xl">
                <Sprout className="text-white" />
                <span>AgriAssist</span>
              </Link>
            </div>
            
            <div className="hidden md:flex items-center gap-6">
              <div className="flex items-center gap-2">
                <UserCircle size={20} />
                <span className="font-medium">{user?.name || 'ব্যবহারকারী'}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-1 hover:text-green-200 transition-colors"
              >
                <LogOut size={18} />
                <span>লগআউট</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex flex-1 relative">
        {/* Sidebar */}
        <AnimatePresence>
          {(isSidebarOpen || window.innerWidth >= 1024) && (
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`
                fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 
                transform transition-transform duration-300 ease-in-out lg:translate-x-0
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
              `}
            >
              <div className="h-full flex flex-col py-6 px-4">
                <div className="space-y-2">
                  {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = location.pathname === link.to;
                    return (
                      <Link
                        key={link.to}
                        to={link.to}
                        onClick={() => setIsSidebarOpen(false)}
                        className={`
                          flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                          ${isActive 
                            ? 'bg-primary text-white shadow-md' 
                            : 'text-gray-600 hover:bg-primary-light hover:text-primary'}
                        `}
                      >
                        <Icon size={20} />
                        <span className="font-medium">{link.label}</span>
                      </Link>
                    );
                  })}
                </div>

                <div className="mt-auto pt-6 border-t border-gray-100 md:hidden">
                  <button 
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <LogOut size={20} />
                    <span className="font-medium">লগআউট</span>
                  </button>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
