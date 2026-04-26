/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CropCase, User } from './types';

export const mockUsers: User[] = [
  { id: 'f1', name: 'আব্দুর রহমান', role: 'farmer', phone: '01711111111' },
  { id: 'fo1', name: 'করিম উদ্দিন', role: 'field_officer', email: 'officer@agriassist.com' },
  { id: 'e1', name: 'ডঃ শফিকুল ইসলাম', role: 'expert', email: 'expert@agriassist.com' },
];

export const mockCases: CropCase[] = [
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
