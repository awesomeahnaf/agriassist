/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CropCase, ExpertUpdate } from '../types';

const STORAGE_KEY = 'agriassist_cases';
const UPDATES_KEY = 'agriassist_updates';

// Initial mock data
const initialCases: CropCase[] = [
  {
    id: 'CASE-001',
    farmerId: 'f1',
    cropName: 'ধান',
    problemType: 'পোকা আক্রমণ',
    description: 'ধানের পাতায় বাদামী দাগ দেখা যাচ্ছে এবং গাছ শুকিয়ে যাচ্ছে।',
    location: 'বগুড়া',
    status: 'pending',
    date: '২০২৪-০৪-১০',
    imageUrl: 'https://picsum.photos/seed/rice/400/300',
  },
  {
    id: 'CASE-002',
    farmerId: 'f1',
    cropName: 'আলু',
    problemType: 'রোগ',
    description: 'আলু গাছের পাতা কোঁকড়ানো এবং কালো দাগ।',
    location: 'বগুড়া',
    status: 'forwarded',
    date: '২০২৪-০৪-০৮',
    imageUrl: 'https://picsum.photos/seed/potato/400/300',
  },
  {
    id: 'CASE-003',
    farmerId: 'f1',
    cropName: 'টমেটো',
    problemType: 'পুষ্টির অভাব',
    description: 'টমেটো ফল ফেটে যাচ্ছে।',
    location: 'বগুড়া',
    status: 'resolved',
    date: '২০২৪-০৪-০৫',
    imageUrl: 'https://picsum.photos/seed/tomato/400/300',
    expertResponse: {
      diagnosis: 'ক্যালসিয়ামের অভাব',
      recommendation: 'জমিতে চুন প্রয়োগ করুন এবং নিয়মিত সেচ দিন।',
      expertId: 'e1',
    },
  },
];

const initialUpdates: ExpertUpdate[] = [
  {
    id: 'UP-001',
    expertId: 'e1',
    expertName: 'ডঃ হাসান',
    title: 'বোরো ধানের ব্লাস্ট রোগ প্রতিরোধ',
    content: 'বর্তমান আবহাওয়ায় বোরো ধানে ব্লাস্ট রোগের প্রকোপ বাড়তে পারে। কৃষকদের নিয়মিত জমি পর্যবেক্ষণ করতে হবে।',
    date: '২০২৪-০৪-১২',
  }
];

const getStoredCases = (): CropCase[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialCases));
    return initialCases;
  }
  return JSON.parse(stored);
};

const getStoredUpdates = (): ExpertUpdate[] => {
  const stored = localStorage.getItem(UPDATES_KEY);
  if (!stored) {
    localStorage.setItem(UPDATES_KEY, JSON.stringify(initialUpdates));
    return initialUpdates;
  }
  return JSON.parse(stored);
};

const saveCases = (cases: CropCase[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
};

const saveUpdates = (updates: ExpertUpdate[]) => {
  localStorage.setItem(UPDATES_KEY, JSON.stringify(updates));
};

export const api = {
  async getCases(): Promise<CropCase[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return getStoredCases();
  },

  async getUpdates(): Promise<ExpertUpdate[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return getStoredUpdates();
  },

  async submitUpdate(data: Partial<ExpertUpdate>): Promise<ExpertUpdate> {
    await new Promise(resolve => setTimeout(resolve, 800));
    const updates = getStoredUpdates();
    const newUpdate = {
      ...data,
      id: `UP-${String(updates.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
    } as ExpertUpdate;
    
    updates.unshift(newUpdate);
    saveUpdates(updates);
    return newUpdate;
  },

  async submitCase(data: Partial<CropCase>): Promise<CropCase> {
    await new Promise(resolve => setTimeout(resolve, 800));
    const cases = getStoredCases();
    const newCase = {
      ...data,
      id: `CASE-${String(cases.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      status: 'pending' as const,
      imageUrl: data.imageUrl || `https://picsum.photos/seed/${Math.random()}/400/300`
    } as CropCase;
    
    cases.push(newCase);
    saveCases(cases);
    return newCase;
  },

  async updateCase(id: string, data: Partial<CropCase>): Promise<CropCase> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const cases = getStoredCases();
    const index = cases.findIndex(c => c.id === id);
    if (index !== -1) {
      cases[index] = { ...cases[index], ...data };
      saveCases(cases);
      return cases[index];
    }
    throw new Error('Case not found');
  }
};
