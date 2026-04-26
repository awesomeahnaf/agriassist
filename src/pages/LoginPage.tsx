/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sprout, Phone, Lock, LogIn, User, UserCheck, Stethoscope } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [role, setRole] = React.useState<'farmer' | 'field_officer' | 'expert'>('farmer');
  const [identifier, setIdentifier] = React.useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(role, identifier || 'demo');
    if (role === 'farmer') navigate('/farmer');
    else if (role === 'field_officer') navigate('/officer');
    else navigate('/expert');
  };

  const quickLogin = (r: 'farmer' | 'field_officer' | 'expert') => {
    login(r, 'quick-login');
    if (r === 'farmer') navigate('/farmer');
    else if (r === 'field_officer') navigate('/officer');
    else navigate('/expert');
  };

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center p-4 bangla-text">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden"
      >
        <div className="bg-primary p-8 text-center text-white">
          <div className="inline-flex p-4 bg-white/20 rounded-full mb-4">
            <Sprout size={48} />
          </div>
          <h1 className="text-3xl font-bold mb-2">AgriAssist</h1>
          <p className="text-green-100">কৃষি সহায়তা ও ফসল সমস্যা ট্র্যাকিং সিস্টেম</p>
        </div>

        <div className="p-8 space-y-8">
          {/* Quick Login Section */}
          <div>
            <p className="text-sm font-bold text-gray-500 mb-4 text-center uppercase tracking-wider">দ্রুত লগইন করুন</p>
            <div className="grid grid-cols-3 gap-3">
              <button 
                onClick={() => quickLogin('farmer')}
                className="flex flex-col items-center gap-2 p-3 rounded-2xl border border-gray-100 hover:border-primary hover:bg-primary-light transition-all group"
              >
                <div className="p-2 bg-gray-50 rounded-xl group-hover:bg-white text-gray-600 group-hover:text-primary">
                  <User size={20} />
                </div>
                <span className="text-xs font-bold">কৃষক</span>
              </button>
              <button 
                onClick={() => quickLogin('field_officer')}
                className="flex flex-col items-center gap-2 p-3 rounded-2xl border border-gray-100 hover:border-primary hover:bg-primary-light transition-all group"
              >
                <div className="p-2 bg-gray-50 rounded-xl group-hover:bg-white text-gray-600 group-hover:text-primary">
                  <UserCheck size={20} />
                </div>
                <span className="text-xs font-bold">অফিসার</span>
              </button>
              <button 
                onClick={() => quickLogin('expert')}
                className="flex flex-col items-center gap-2 p-3 rounded-2xl border border-gray-100 hover:border-primary hover:bg-primary-light transition-all group"
              >
                <div className="p-2 bg-gray-50 rounded-xl group-hover:bg-white text-gray-600 group-hover:text-primary">
                  <Stethoscope size={20} />
                </div>
                <span className="text-xs font-bold">বিশেষজ্ঞ</span>
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-400">অথবা</span></div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="flex bg-gray-100 p-1 rounded-xl">
              {(['farmer', 'field_officer', 'expert'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`
                    flex-1 py-2 text-sm font-medium rounded-lg transition-all
                    ${role === r ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}
                  `}
                >
                  {r === 'farmer' ? 'কৃষক' : r === 'field_officer' ? 'অফিসার' : 'বিশেষজ্ঞ'}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ফোন নম্বর বা ইমেইল</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    placeholder="আপনার ফোন নম্বর লিখুন"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">পাসওয়ার্ড</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="password" 
                    required
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    placeholder="আপনার পাসওয়ার্ড লিখুন"
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl shadow-lg shadow-green-200 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <LogIn size={20} />
              <span>লগইন করুন</span>
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
