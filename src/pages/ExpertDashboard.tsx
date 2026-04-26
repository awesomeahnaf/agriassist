/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Stethoscope, 
  MessageSquare, 
  MapPin, 
  Calendar,
  ArrowRight,
  UserCheck,
  PlusCircle,
  X,
  Send,
  Video,
  Mic,
  Upload,
  Volume2
} from 'lucide-react';
import { api } from '../services/api';
import { CropCase, ExpertUpdate } from '../types';
import Layout from '../components/Layout';
import { motion, AnimatePresence } from 'motion/react';

export default function ExpertDashboard() {
  const navigate = useNavigate();
  const [cases, setCases] = React.useState<CropCase[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [showUpdateModal, setShowUpdateModal] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [recordedVoiceBase64, setRecordedVoiceBase64] = React.useState('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const fetchCases = () => {
    api.getCases().then(data => {
      setCases(data);
      setLoading(false);
    });
  };

  React.useEffect(() => {
    fetchCases();
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("ফাইলের সাইজ ২ মেগাবাইটের বেশি হতে পারবে না।");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setRecordedVoiceBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePostUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.target as HTMLFormElement);
    
    try {
      await api.submitUpdate({
        title: formData.get('title') as string,
        content: formData.get('content') as string,
        videoUrl: formData.get('videoUrl') as string,
        voiceUrl: recordedVoiceBase64 || formData.get('voiceUrl') as string,
        expertId: 'e1',
        expertName: 'ডঃ হাসান'
      });
      alert('আপডেটটি সফলভাবে পোস্ট করা হয়েছে!');
      setShowUpdateModal(false);
      setRecordedVoiceBase64('');
    } catch (error) {
      alert('পোস্ট করা যায়নি।');
    } finally {
      setIsSubmitting(false);
    }
  };

  const forwardedCases = cases.filter(c => c.status === 'forwarded');

  return (
    <Layout role="expert">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">বিশেষজ্ঞ ড্যাশবোর্ড</h1>
            <p className="text-gray-600">ফিল্ড অফিসার কর্তৃক প্রেরিত ইউনিক সমস্যাগুলো সমাধান করুন।</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setShowUpdateModal(true)}
              className="bg-white border-2 border-purple-100 text-purple-700 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-purple-50 transition-all"
            >
              <PlusCircle size={20} />
              <span>সাধারণ আপডেট পোস্ট করুন</span>
            </button>
            <div className="bg-purple-100 text-purple-700 px-4 py-2 rounded-xl font-bold flex items-center gap-2">
              <Stethoscope size={20} />
              <span>{forwardedCases.length}টি নতুন সমস্যা</span>
            </div>
          </div>
        </div>

        {/* Update Modal */}
        <AnimatePresence>
          {showUpdateModal && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowUpdateModal(false)}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden"
              >
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="text-xl font-bold text-gray-800">সাধারণ আপডেট পোস্ট করুন</h3>
                  <button onClick={() => setShowUpdateModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <X size={20} className="text-gray-400" />
                  </button>
                </div>
                
                <form onSubmit={handlePostUpdate} className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">শিরোনাম (Title)</label>
                    <input 
                      name="title"
                      required
                      placeholder="যেমন: ধানের ব্লাস্ট রোগ প্রতিরোধ"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">বিস্তারিত তথ্য (Content)</label>
                    <textarea 
                      name="content"
                      required
                      rows={4}
                      placeholder="বিস্তারিত তথ্য এখানে লিখুন..."
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all resize-none"
                    ></textarea>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">ভিডিও লিঙ্ক (ঐচ্ছিক)</label>
                      <input 
                        name="videoUrl"
                        type="url"
                        placeholder="https://..."
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">ভয়েস লিঙ্ক (যদি থাকে)</label>
                      <input 
                        name="voiceUrl"
                        type="url"
                        placeholder="https://..."
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="relative">
                      <input 
                        type="file" 
                        accept="audio/*" 
                        onChange={handleFileUpload}
                        className="hidden" 
                        ref={fileInputRef}
                      />
                      <button 
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full flex items-center justify-center gap-2 py-2 border border-dashed border-gray-200 rounded-xl text-gray-500 hover:text-purple-600 hover:border-purple-200 text-xs transition-all font-bold"
                      >
                        <Upload size={14} />
                        <span>অডিও ফাইল আপলোড (Max 2MB)</span>
                      </button>
                    </div>
                  </div>
                  
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-100 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  >
                    <Send size={20} />
                    <span>{isSubmitting ? 'পোস্ট করা হচ্ছে...' : 'পোস্ট করুন'}</span>
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <div className="space-y-4">
          {loading ? (
            <div className="p-12 text-center text-gray-500">লোড হচ্ছে...</div>
          ) : forwardedCases.length === 0 ? (
            <div className="p-12 text-center text-gray-500">কোনো নতুন সমস্যা নেই।</div>
          ) : (
            forwardedCases.map((c) => (
              <div key={c.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-64 h-48 md:h-auto bg-gray-100 flex-shrink-0">
                    <img src={c.imageUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 p-6 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{c.cropName} - {c.problemType}</h3>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <MapPin size={14} />
                            <span>{c.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            <span>{c.date}</span>
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-mono text-gray-400">{c.id}</span>
                    </div>
                    
                    <div className="flex justify-between items-end">
                      <div className="flex-1">
                        <p className="text-gray-700 mb-2">
                          <span className="font-bold text-gray-800">বিবরণ:</span> {c.description}
                        </p>
                        {c.fieldOfficerNotes && (c.fieldOfficerNotes.videoUrl || c.fieldOfficerNotes.voiceUrl) && (
                          <div className="flex items-center gap-2 text-blue-600 text-xs font-bold">
                            <UserCheck size={14} />
                            <span>ফিল্ড অফিসারের নোট যুক্ত আছে</span>
                          </div>
                        )}
                      </div>
                      <button 
                        onClick={() => navigate(`/expert/response/${c.id}`)}
                        className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-dark transition-all shadow-lg shadow-green-100 ml-4"
                      >
                        <MessageSquare size={20} />
                        <span>সমাধান দিন</span>
                        <ArrowRight size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
