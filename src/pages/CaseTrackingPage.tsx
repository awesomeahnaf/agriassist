/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  ExternalLink,
  Clock,
  CheckCircle2,
  AlertCircle,
  X,
  Video,
  Mic,
  Stethoscope,
  UserCheck,
  MapPin,
  Calendar
} from 'lucide-react';
import { api } from '../services/api';
import { CropCase } from '../types';
import Layout from '../components/Layout';
import { motion, AnimatePresence } from 'motion/react';

export default function CaseTrackingPage() {
  const [cases, setCases] = React.useState<CropCase[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedCase, setSelectedCase] = React.useState<CropCase | null>(null);

  React.useEffect(() => {
    api.getCases().then(data => {
      setCases(data);
      setLoading(false);
    });
  }, []);

  return (
    <Layout role="farmer">
      <div className="space-y-6">
        {/* ... existing header ... */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">সমস্যার অবস্থা ট্র্যাকিং</h1>
            <p className="text-gray-600">আপনার জমা দেওয়া সকল সমস্যার তালিকা ও বর্তমান অবস্থা।</p>
          </div>
          
          <div className="flex gap-2">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="খুঁজুন..."
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
              />
            </div>
            <button className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <Filter size={20} className="text-gray-600" />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-sm font-bold text-gray-600">আইডি</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-600">ফসলের নাম</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-600">তারিখ</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-600">অবস্থা</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-600 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">লোড হচ্ছে...</td>
                  </tr>
                ) : cases.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">কোনো সমস্যা পাওয়া যায়নি।</td>
                  </tr>
                ) : (
                  cases.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-gray-500">{c.id}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100">
                            <img src={c.imageUrl} alt="" className="w-full h-full object-cover" />
                          </div>
                          <span className="font-bold text-gray-800">{c.cropName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{c.date}</td>
                      <td className="px-6 py-4">
                        <span className={`
                          inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold
                          ${c.status === 'pending' ? 'bg-amber-100 text-amber-700' : 
                            c.status === 'forwarded' ? 'bg-purple-100 text-purple-700' : 
                            c.status === 'expert_responded' ? 'bg-blue-100 text-blue-700' : 
                            'bg-green-100 text-green-700'}
                        `}>
                          {c.status === 'pending' ? <Clock size={14} /> : 
                           c.status === 'forwarded' ? <AlertCircle size={14} /> : 
                           c.status === 'expert_responded' ? <AlertCircle size={14} /> : 
                           <CheckCircle2 size={14} />}
                          {c.status === 'pending' ? 'অপেক্ষমান' : 
                           c.status === 'forwarded' ? 'বিশেষজ্ঞের কাছে' : 
                           c.status === 'expert_responded' ? 'বিশেষজ্ঞ উত্তর দিয়েছেন' : 
                           'সমাধান হয়েছে'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => setSelectedCase(c)}
                          className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-primary"
                        >
                          <ExternalLink size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Details Modal */}
        <AnimatePresence>
          {selectedCase && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedCase(null)}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
              >
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold text-gray-800">সমস্যার বিস্তারিত</h3>
                    <span className="text-xs font-mono text-gray-400">{selectedCase.id}</span>
                  </div>
                  <button onClick={() => setSelectedCase(null)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                    <X size={20} className="text-gray-400" />
                  </button>
                </div>
                
                <div className="p-6 overflow-y-auto space-y-8">
                  {/* Problem Info */}
                  <div className="flex gap-6">
                    <div className="w-32 h-32 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
                      <img src={selectedCase.imageUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-lg font-bold text-gray-800">{selectedCase.cropName} - {selectedCase.problemType}</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">{selectedCase.description}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <MapPin size={12} />
                        <span>{selectedCase.location}</span>
                        <span className="mx-1">•</span>
                        <Calendar size={12} />
                        <span>{selectedCase.date}</span>
                      </div>
                    </div>
                  </div>

                  {/* Expert Response (Only visible when resolved by officer) */}
                  {selectedCase.status === 'resolved' && selectedCase.expertResponse ? (
                    <div className="bg-green-50/50 border border-green-100 rounded-2xl p-6 space-y-4">
                      <div className="flex items-center gap-2 text-primary font-bold">
                        <Stethoscope size={20} />
                        <span>বিশেষজ্ঞের পরামর্শ</span>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs font-bold text-green-700 uppercase tracking-wider">রোগ নির্ণয়</p>
                          <p className="text-gray-800 font-medium">{selectedCase.expertResponse.diagnosis}</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-green-700 uppercase tracking-wider">সমাধান</p>
                          <p className="text-gray-700 leading-relaxed">{selectedCase.expertResponse.recommendation}</p>
                        </div>
                        {(selectedCase.expertResponse.videoUrl || selectedCase.expertResponse.voiceUrl) && (
                          <div className="flex gap-3 pt-2">
                            {selectedCase.expertResponse.videoUrl && (
                              <a href={selectedCase.expertResponse.videoUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-white border border-green-200 rounded-xl text-sm font-bold text-green-700 hover:bg-green-100 transition-all">
                                <Video size={16} />
                                <span>ভিডিও দেখুন</span>
                              </a>
                            )}
                            {selectedCase.expertResponse.voiceUrl && (
                              <div className="w-full">
                                <p className="text-[10px] font-bold text-green-700 uppercase tracking-wider mb-2">ভয়েস পরামর্শ</p>
                                <audio src={selectedCase.expertResponse.voiceUrl} controls className="w-full h-8" />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 flex items-center gap-3 text-amber-700">
                      <Clock size={20} />
                      <span className="font-medium">বিশেষজ্ঞের পরামর্শের জন্য অপেক্ষা করা হচ্ছে...</span>
                    </div>
                  )}

                  {/* Field Officer Notes */}
                  {selectedCase.fieldOfficerNotes && (selectedCase.fieldOfficerNotes.videoUrl || selectedCase.fieldOfficerNotes.voiceUrl) && (
                    <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6 space-y-4">
                      <div className="flex items-center gap-2 text-blue-700 font-bold">
                        <UserCheck size={20} />
                        <span>ফিল্ড অফিসারের সহায়তা</span>
                      </div>
                      <div className="flex gap-3">
                        {selectedCase.fieldOfficerNotes.videoUrl && (
                          <a href={selectedCase.fieldOfficerNotes.videoUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-white border border-blue-200 rounded-xl text-sm font-bold text-blue-700 hover:bg-blue-100 transition-all">
                            <Video size={16} />
                            <span>ভিডিও টিউটোরিয়াল</span>
                          </a>
                        )}
                        {selectedCase.fieldOfficerNotes.voiceUrl && (
                          <a href={selectedCase.fieldOfficerNotes.voiceUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-white border border-blue-200 rounded-xl text-sm font-bold text-blue-700 hover:bg-blue-100 transition-all">
                            <Mic size={16} />
                            <span>ভয়েস পরামর্শ</span>
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}
