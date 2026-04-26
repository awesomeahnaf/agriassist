/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, 
  MapPin, 
  Send, 
  Image as ImageIcon,
  X
} from 'lucide-react';
import { motion } from 'motion/react';
import Layout from '../components/Layout';

import { api } from '../services/api';

export default function SubmitProblemPage() {
  const navigate = useNavigate();
  const [preview, setPreview] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      cropName: formData.get('cropName') as string,
      problemType: formData.get('problemType') as string,
      description: formData.get('description') as string,
      location: formData.get('location') as string,
      imageUrl: preview || 'https://picsum.photos/seed/agri/400/300',
      farmerId: 'f1'
    };

    try {
      await api.submitCase(data);
      alert('সমস্যাটি সফলভাবে জমা দেওয়া হয়েছে!');
      navigate('/farmer');
    } catch (error) {
      alert('দুঃখিত, সমস্যাটি জমা দেওয়া যায়নি।');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout role="farmer">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">নতুন সমস্যা জমা দিন</h1>
          <p className="text-gray-600">আপনার ফসলের সমস্যার বিস্তারিত তথ্য প্রদান করুন।</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ফসলের নাম</label>
                <select 
                  name="cropName"
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all appearance-none"
                >
                  <option value="">ফসল নির্বাচন করুন</option>
                  <option value="ধান">ধান</option>
                  <option value="আলু">আলু</option>
                  <option value="টমেটো">টমেটো</option>
                  <option value="গম">গম</option>
                  <option value="ভুট্টা">ভুট্টা</option>
                  <option value="সরিষা">সরিষা</option>
                  <option value="পেঁয়াজ">পেঁয়াজ</option>
                  <option value="আম">আম</option>
                  <option value="কাঁঠাল">কাঁঠাল</option>
                  <option value="অন্যান্য">অন্যান্য</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">সমস্যার ধরন</label>
                <select name="problemType" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all appearance-none">
                  <option value="পোকা আক্রমণ">পোকা আক্রমণ</option>
                  <option value="রোগ">রোগ</option>
                  <option value="পুষ্টির অভাব">পুষ্টির অভাব</option>
                  <option value="আগাছা সমস্যা">আগাছা সমস্যা</option>
                  <option value="সেচ সমস্যা">সেচ সমস্যা</option>
                  <option value="অন্যান্য">অন্যান্য</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">সমস্যার বর্ণনা</label>
              <textarea 
                name="description"
                required
                rows={4}
                placeholder="সমস্যাটি বিস্তারিতভাবে লিখুন..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">এলাকা / অবস্থান</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  name="location"
                  type="text" 
                  required
                  placeholder="আপনার গ্রামের নাম বা এলাকা লিখুন"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ফসলের ছবি আপলোড করুন</label>
              {!preview ? (
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:bg-gray-50 hover:border-primary transition-all group">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <div className="p-3 bg-primary-light text-primary rounded-full mb-3 group-hover:scale-110 transition-transform">
                      <Upload size={24} />
                    </div>
                    <p className="text-sm text-gray-600 font-medium">ছবি নির্বাচন করতে এখানে ক্লিক করুন</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG (সর্বোচ্চ ৫ মেগাবাইট)</p>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                </label>
              ) : (
                <div className="relative rounded-2xl overflow-hidden h-48 group">
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  <button 
                    type="button"
                    onClick={() => setPreview(null)}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 px-6 py-4 border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-all"
            >
              বাতিল করুন
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="flex-[2] bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl shadow-lg shadow-green-100 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              <Send size={20} />
              <span>{isSubmitting ? 'জমা হচ্ছে...' : 'জমা দিন'}</span>
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
