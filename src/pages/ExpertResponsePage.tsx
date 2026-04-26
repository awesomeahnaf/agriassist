/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Send, 
  Mic, 
  FileText, 
  Stethoscope,
  ArrowLeft,
  Play,
  Square,
  Video,
  Upload,
  Volume2
} from 'lucide-react';
import { api } from '../services/api';
import { CropCase } from '../types';
import Layout from '../components/Layout';

export default function ExpertResponsePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cropCase, setCropCase] = React.useState<CropCase | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [recordedVoiceBase64, setRecordedVoiceBase64] = React.useState('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    api.getCases().then(data => {
      const found = data.find(c => c.id === id);
      setCropCase(found || null);
      setLoading(false);
    });
  }, [id]);

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

  if (loading) return <div className="p-12 text-center bangla-text">লোড হচ্ছে...</div>;
  if (!cropCase) return <div className="p-12 text-center bangla-text">সমস্যাটি পাওয়া যায়নি।</div>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const response = {
      diagnosis: formData.get('diagnosis') as string,
      recommendation: formData.get('recommendation') as string,
      videoUrl: formData.get('videoUrl') as string,
      voiceUrl: recordedVoiceBase64 || formData.get('voiceUrl') as string,
      expertId: 'e1'
    };

    try {
      await api.updateCase(cropCase.id, {
        status: 'expert_responded',
        expertResponse: response
      });
      alert('সমাধানটি সফলভাবে পাঠানো হয়েছে!');
      navigate('/expert');
    } catch (error) {
      alert('দুঃখিত, সমাধানটি পাঠানো যায়নি।');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout role="expert">
      <div className="max-w-4xl mx-auto space-y-8">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 font-bold hover:text-primary transition-colors"
        >
          <ArrowLeft size={20} />
          <span>পিছনে যান</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Case Info Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <img src={cropCase.imageUrl} alt="" className="w-full h-48 object-cover" />
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-2">{cropCase.cropName}</h2>
                <div className="inline-block px-3 py-1 bg-primary-light text-primary rounded-full text-xs font-bold mb-4">
                  {cropCase.problemType}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  <span className="font-bold block mb-1 text-gray-800">বিবরণ:</span>
                  {cropCase.description}
                </p>

                {cropCase.fieldOfficerNotes && (cropCase.fieldOfficerNotes.videoUrl || cropCase.fieldOfficerNotes.voiceUrl) && (
                  <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">ফিল্ড অফিসারের নোট</p>
                    <div className="flex flex-wrap gap-2">
                      {cropCase.fieldOfficerNotes.videoUrl && (
                        <a href={cropCase.fieldOfficerNotes.videoUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors">
                          <Video size={14} />
                          <span>ভিডিও</span>
                        </a>
                      )}
                      {cropCase.fieldOfficerNotes.voiceUrl && (
                        <audio src={cropCase.fieldOfficerNotes.voiceUrl} controls className="w-full h-8 mt-2" />
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Response Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-primary-light text-primary rounded-lg">
                    <Stethoscope size={24} />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">আপনার সমাধান প্রদান করুন</h2>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">রোগ বা সমস্যার নির্ণয় (Diagnosis)</label>
                  <input 
                    name="diagnosis"
                    type="text" 
                    required
                    placeholder="যেমন: ক্যালসিয়ামের অভাব বা ছত্রাক আক্রমণ"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">পরামর্শ ও সমাধান (Recommendation)</label>
                  <textarea 
                    name="recommendation"
                    required
                    rows={6}
                    placeholder="কৃষকের জন্য বিস্তারিত পরামর্শ এখানে লিখুন..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ভিডিও টিউটোরিয়াল লিঙ্ক (ঐচ্ছিক)</label>
                    <input 
                      name="videoUrl"
                      type="url" 
                      placeholder="https://youtube.com/..."
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ভয়েস মেসেজ লিঙ্ক (যদি ইতিমধ্যে থাকে)</label>
                    <input 
                      name="voiceUrl"
                      type="url" 
                      placeholder="অডিও ফাইলের লিঙ্ক"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex flex-col gap-6">
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
                      className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-200 rounded-2xl text-gray-500 hover:border-primary hover:text-primary transition-all font-bold"
                    >
                      <Upload size={20} />
                      <span>অডিও ফাইল আপলোড করুন (Max 2MB)</span>
                    </button>
                    {recordedVoiceBase64 && !recordedVoiceBase64.startsWith('dataUrl:') && (
                      <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-xl flex items-center gap-2 text-sm font-bold animate-in fade-in slide-in-from-top-1">
                        <Volume2 size={16} />
                        <span>অডিও ফাইল সংযুক্ত করা হয়েছে</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl shadow-lg shadow-green-100 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                <Send size={20} />
                <span>{isSubmitting ? 'পাঠানো হচ্ছে...' : 'সমাধান পাঠান'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
