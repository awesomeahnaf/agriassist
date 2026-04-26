/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'farmer' | 'field_officer' | 'expert';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  phone?: string;
  email?: string;
}

export type CaseStatus = 'pending' | 'forwarded' | 'expert_responded' | 'resolved';

export interface ExpertUpdate {
  id: string;
  expertId: string;
  expertName: string;
  title: string;
  content: string;
  videoUrl?: string;
  voiceUrl?: string;
  date: string;
}

export interface CropCase {
  id: string;
  farmerId: string;
  cropName: string;
  problemType: string;
  description: string;
  location: string;
  status: CaseStatus;
  date: string;
  imageUrl?: string;
  expertResponse?: {
    diagnosis: string;
    recommendation: string;
    videoUrl?: string;
    voiceUrl?: string;
    expertId: string;
  };
  fieldOfficerNotes?: {
    videoUrl?: string;
    voiceUrl?: string;
    officerId: string;
  };
}
