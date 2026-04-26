/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { 
  PlusCircle, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ChevronRight,
  Calendar,
  Newspaper,
  Video,
  Mic
} from 'lucide-react';
import { motion } from 'motion/react';
import { api } from '../services/api';
import { CropCase, ExpertUpdate } from '../types';
import Layout from '../components/Layout';

export default function FarmerDashboard() {
  const [cases, setCases] = React.useState<CropCase[]>([]);
  const [updates, setUpdates] = React.useState<ExpertUpdate[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    Promise.all([api.getCases(), api.getUpdates()]).then(([casesData, updatesData]) => {
      setCases(casesData);
      setUpdates(updatesData);
      setLoading(false);
    });
  }, []);

  const stats = [
    { label: 'মোট সমস্যা', value: cases.length, icon: AlertCircle, color: 'bg-blue-500' },
    { label: 'অপেক্ষমান', value: cases.filter(c => c.status === 'pending' || c.status === 'forwarded' || c.status === 'expert_responded').length, icon: Clock, color: 'bg-amber-500' },
    { label: 'সমাধান হয়েছে', value: cases.filter(c => c.status === 'resolved').length, icon: CheckCircle2, color: 'bg-green-500' },
  ];

  return (
    <Layout role="farmer">
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">স্বাগতম, আব্দুর রহমান!</h1>
            <p className="text-gray-600">আপনার ফসলের যত্ন নিতে আমরা আপনার পাশে আছি।</p>
          </div>
          <Link 
            to="/farmer/submit"
            className="inline-flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-dark transition-all shadow-lg shadow-green-100"
          >
            <PlusCircle size={20} />
            <span>নতুন সমস্যা জমা দিন</span>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4"
              >
                <div className={`${stat.color} p-3 rounded-xl text-white`}>
                  <Icon size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Cases */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h2 className="font-bold text-lg text-gray-800">সাম্প্রতিক সমস্যাসমূহ</h2>
                <Link to="/farmer/tracking" className="text-primary text-sm font-bold hover:underline">সবগুলো দেখুন</Link>
              </div>
              <div className="divide-y divide-gray-50">
                {loading ? (
                  <div className="p-12 text-center text-gray-500">লোড হচ্ছে...</div>
                ) : cases.length === 0 ? (
                  <div className="p-12 text-center text-gray-500">কোনো সমস্যা পাওয়া যায়নি।</div>
                ) : (
                  cases.slice(0, 3).map((c) => (
                    <div key={c.id} className="p-6 hover:bg-gray-50 transition-colors flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                          <img src={c.imageUrl} alt={c.cropName} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-800">{c.cropName} - {c.problemType}</h3>
                          <div className="flex items-center gap-3 mt-1">
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Calendar size={14} />
                              <span>{c.date}</span>
                            </div>
                            <span className={`
                              text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider
                              ${c.status === 'pending' ? 'bg-amber-100 text-amber-700' : 
                                c.status === 'forwarded' ? 'bg-purple-100 text-purple-700' : 
                                c.status === 'expert_responded' ? 'bg-blue-100 text-blue-700' : 
                                'bg-green-100 text-green-700'}
                            `}>
                              {c.status === 'pending' ? 'অপেক্ষমান' : 
                               c.status === 'forwarded' ? 'বিশেষজ্ঞের কাছে' : 
                               c.status === 'expert_responded' ? 'বিশেষজ্ঞ উত্তর দিয়েছেন' : 
                               'সমাধান হয়েছে'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="text-gray-300" />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Expert Updates Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                <Newspaper size={20} className="text-primary" />
                <h2 className="font-bold text-lg text-gray-800">বিশেষজ্ঞ আপডেট</h2>
              </div>
              <div className="p-4 space-y-4">
                {updates.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">কোনো আপডেট নেই।</p>
                ) : (
                  updates.slice(0, 3).map(update => (
                    <div key={update.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <h3 className="font-bold text-gray-800 mb-1">{update.title}</h3>
                      <p className="text-xs text-gray-600 line-clamp-2 mb-3">{update.content}</p>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] text-gray-400">{update.date}</span>
                        <div className="flex gap-2">
                          {update.videoUrl && (
                            <a href={update.videoUrl} target="_blank" rel="noreferrer" title="ভিডিও দেখুন">
                              <Video size={14} className="text-primary hover:scale-110 transition-transform" />
                            </a>
                          )}
                        </div>
                      </div>
                      {update.voiceUrl && (
                        <div className="mt-2 pt-2 border-t border-gray-100">
                          <audio src={update.voiceUrl} controls className="w-full h-8" />
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
