/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Video, 
  Mic, 
  Send, 
  MapPin, 
  User,
  ExternalLink,
  Search,
  X,
  CheckCircle,
  Bell,
  Newspaper,
  Upload,
  Volume2
} from 'lucide-react';
import { api } from '../services/api';
import { CropCase, CaseStatus, ExpertUpdate } from '../types';
import Layout from '../components/Layout';
import { motion, AnimatePresence } from 'motion/react';

export default function FieldOfficerPage() {
  const [cases, setCases] = React.useState<CropCase[]>([]);
  const [updates, setUpdates] = React.useState<ExpertUpdate[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedCase, setSelectedCase] = React.useState<CropCase | null>(null);
  const [actionType, setActionType] = React.useState<'video' | 'voice' | null>(null);
  const [inputValue, setInputValue] = React.useState('');
  const [recordedVoiceBase64, setRecordedVoiceBase64] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = React.useState<CaseStatus | 'all' | 'updates'>('all');

  const fetchData = async () => {
    const [casesData, updatesData] = await Promise.all([
      api.getCases(),
      api.getUpdates()
    ]);
    setCases(casesData);
    setUpdates(updatesData);
    setLoading(false);
  };

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

  React.useEffect(() => {
    fetchData();
  }, []);

  const handleSubmitAction = async () => {
    if (!selectedCase || !actionType) return;
    if (!inputValue && !recordedVoiceBase64 && actionType === 'voice') return;
    if (!inputValue && actionType === 'video') return;
    
    setIsSubmitting(true);
    try {
      const updateData: any = {
        fieldOfficerNotes: {
          ...selectedCase.fieldOfficerNotes,
          officerId: 'o1',
          [actionType === 'video' ? 'videoUrl' : 'voiceUrl']: recordedVoiceBase64 || inputValue
        }
      };
      
      await api.updateCase(selectedCase.id, updateData);
      alert('সফলভাবে পাঠানো হয়েছে!');
      setSelectedCase(null);
      setActionType(null);
      setInputValue('');
      setRecordedVoiceBase64('');
      fetchData();
    } catch (error) {
      alert('দুঃখিত, পাঠানো যায়নি।');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForwardToExpert = async (caseId: string) => {
    try {
      await api.updateCase(caseId, { status: 'forwarded' });
      alert('বিশেষজ্ঞের কাছে পাঠানো হয়েছে!');
      fetchData();
    } catch (error) {
      alert('পাঠানো যায়নি।');
    }
  };

  const handleResolveCase = async (caseId: string) => {
    try {
      await api.updateCase(caseId, { status: 'resolved' });
      alert('সমস্যাটি সমাধান করা হয়েছে!');
      fetchData();
    } catch (error) {
      alert('আপডেট করা যায়নি।');
    }
  };

  const filteredCases = cases.filter(c => activeTab === 'all' || c.status === activeTab);

  return (
    <Layout role="field_officer">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">ফিল্ড অফিসার ড্যাশবোর্ড</h1>
            <p className="text-gray-600">কৃষকদের সমস্যাগুলো দেখুন এবং প্রয়োজনীয় পরামর্শ প্রদান করুন।</p>
          </div>
          
          <div className="relative md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="কৃষক বা ফসল খুঁজুন..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            { id: 'all', label: 'সবগুলো' },
            { id: 'updates', label: 'বিশেষজ্ঞ আপডেট' },
            { id: 'pending', label: 'নতুন' },
            { id: 'forwarded', label: 'বিশেষজ্ঞের কাছে' },
            { id: 'expert_responded', label: 'বিশেষজ্ঞের উত্তর' },
            { id: 'resolved', label: 'সমাধানকৃত' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${activeTab === tab.id ? 'bg-primary text-white shadow-lg shadow-green-100' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            >
              {tab.id === 'updates' && updates.length > 0 && (
                <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
              )}
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'updates' ? (
          <div className="space-y-6">
            {updates.length === 0 ? (
              <div className="p-12 text-center text-gray-500">কোনো আপডেট নেই।</div>
            ) : (
              updates.map(update => (
                <motion.div 
                  key={update.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                        <Newspaper size={24} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{update.title}</h3>
                        <p className="text-sm text-gray-500">{update.expertName} • {update.date}</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-6">{update.content}</p>
                  <div className="flex gap-4">
                    {update.videoUrl && (
                      <a href={update.videoUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-primary font-bold hover:underline">
                        <Video size={18} />
                        <span>ভিডিও দেখুন</span>
                      </a>
                    )}
                    {update.voiceUrl && (
                      <a href={update.voiceUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-primary font-bold hover:underline">
                        <Mic size={18} />
                        <span>ভয়েস শুনুন</span>
                      </a>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {loading ? (
            <div className="lg:col-span-2 p-12 text-center text-gray-500">লোড হচ্ছে...</div>
          ) : filteredCases.length === 0 ? (
            <div className="lg:col-span-2 p-12 text-center text-gray-500">কোনো সমস্যা পাওয়া যায়নি।</div>
          ) : (
            filteredCases.map((c) => (
              <div key={c.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                <div className="p-6 flex gap-4 border-b border-gray-50">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
                    <img src={c.imageUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-lg text-gray-800">{c.cropName} - {c.problemType}</h3>
                      <span className="text-[10px] font-mono text-gray-400">{c.id}</span>
                    </div>
                    <div className="space-y-1 mt-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User size={14} className="text-primary" />
                        <span>কৃষক: আব্দুর রহমান</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin size={14} className="text-primary" />
                        <span>অবস্থান: {c.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 bg-gray-50/50 flex-1">
                  <p className="text-sm text-gray-700 line-clamp-2 mb-4 italic">"{c.description}"</p>
                  
                  {c.status === 'expert_responded' && (
                    <div className="mb-4 p-4 bg-purple-50 border border-purple-100 rounded-2xl">
                      <h4 className="text-xs font-bold text-purple-700 mb-1 uppercase tracking-wider">বিশেষজ্ঞের পরামর্শ:</h4>
                      <p className="text-sm text-purple-900 font-medium">{c.expertResponse?.diagnosis}</p>
                      <p className="text-xs text-purple-700 mt-1">{c.expertResponse?.recommendation}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    {c.status === 'pending' && (
                      <button 
                        onClick={() => handleForwardToExpert(c.id)}
                        className="col-span-2 flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-xl text-sm font-bold hover:bg-purple-700 transition-all shadow-lg shadow-purple-100"
                      >
                        <Send size={16} />
                        <span>বিশেষজ্ঞের কাছে পাঠান (ইউনিক সমস্যা)</span>
                      </button>
                    )}
                    
                    {(c.status === 'pending' || c.status === 'expert_responded') && (
                      <button 
                        onClick={() => handleResolveCase(c.id)}
                        className="col-span-2 flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary-dark transition-all shadow-lg shadow-green-100"
                      >
                        <CheckCircle size={16} />
                        <span>সমাধান নিশ্চিত করুন</span>
                      </button>
                    )}

                    <button 
                      onClick={() => { setSelectedCase(c); setActionType('video'); }}
                      className={`flex items-center justify-center gap-2 px-4 py-2.5 border rounded-xl text-sm font-bold transition-all ${c.fieldOfficerNotes?.videoUrl ? 'bg-green-50 border-green-200 text-green-700' : 'bg-white border-gray-200 text-gray-700 hover:bg-primary-light hover:text-primary hover:border-primary'}`}
                    >
                      {c.fieldOfficerNotes?.videoUrl ? <CheckCircle size={16} /> : <Video size={16} />}
                      <span>{c.fieldOfficerNotes?.videoUrl ? 'ভিডিও পাঠানো হয়েছে' : 'ভিডিও পাঠান'}</span>
                    </button>
                    <button 
                      onClick={() => { setSelectedCase(c); setActionType('voice'); }}
                      className={`flex items-center justify-center gap-2 px-4 py-2.5 border rounded-xl text-sm font-bold transition-all ${c.fieldOfficerNotes?.voiceUrl ? 'bg-green-50 border-green-200 text-green-700' : 'bg-white border-gray-200 text-gray-700 hover:bg-primary-light hover:text-primary hover:border-primary'}`}
                    >
                      {c.fieldOfficerNotes?.voiceUrl ? <CheckCircle size={16} /> : <Mic size={16} />}
                      <span>{c.fieldOfficerNotes?.voiceUrl ? 'ভয়েস পাঠানো হয়েছে' : 'ভয়েস পাঠান'}</span>
                    </button>
                  </div>
                </div>

                <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center">
                  <span className={`
                    text-xs font-bold px-3 py-1 rounded-full
                    ${c.status === 'pending' ? 'bg-amber-100 text-amber-700' : 
                      c.status === 'forwarded' ? 'bg-purple-100 text-purple-700' : 
                      c.status === 'expert_responded' ? 'bg-blue-100 text-blue-700' : 
                      'bg-green-100 text-green-700'}
                  `}>
                    {c.status === 'pending' ? 'অপেক্ষমান' : 
                     c.status === 'forwarded' ? 'বিশেষজ্ঞের কাছে পাঠানো হয়েছে' : 
                     c.status === 'expert_responded' ? 'বিশেষজ্ঞ উত্তর দিয়েছেন' : 
                     'সমাধান হয়েছে'}
                  </span>
                </div>
              </div>
            ))
          )}
          </div>
        )}

        {/* Action Modal */}
        <AnimatePresence>
          {selectedCase && actionType && (
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
                className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
              >
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="text-xl font-bold text-gray-800">
                    {actionType === 'video' ? 'ভিডিও টিউটোরিয়াল পাঠান' : 'ভয়েস মেসেজ পাঠান'}
                  </h3>
                  <button onClick={() => setSelectedCase(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <X size={20} className="text-gray-400" />
                  </button>
                </div>
                
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {actionType === 'video' ? 'ভিডিও লিঙ্ক (YouTube/Drive)' : 'অডিও লিঙ্ক (যদি ইতিমধ্যে থাকে)'}
                    </label>
                    <input 
                      type="url"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
                    />
                  </div>

                  {actionType === 'voice' && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-gray-700">ভয়েস মেসেজ লিঙ্ক (যদি ইতিমধ্যে থাকে)</label>
                        <span className="text-[10px] text-gray-400">অথবা ফাইল আপলোড</span>
                      </div>
                      
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
                          className="w-full flex items-center justify-center gap-2 py-2 border border-dashed border-gray-200 rounded-xl text-gray-500 hover:text-primary hover:border-primary text-xs transition-all font-bold"
                        >
                          <Upload size={14} />
                          <span>অডিও ফাইল আপলোড (Max 2MB)</span>
                        </button>
                      </div>
                    </div>
                  )}
                  
                  <button 
                    onClick={handleSubmitAction}
                    disabled={isSubmitting || (actionType === 'video' ? !inputValue : (!inputValue && !recordedVoiceBase64))}
                    className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl shadow-lg shadow-green-100 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  >
                    <Send size={20} />
                    <span>{isSubmitting ? 'পাঠানো হচ্ছে...' : 'পাঠিয়ে দিন'}</span>
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}
