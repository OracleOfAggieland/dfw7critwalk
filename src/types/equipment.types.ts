import { Timestamp } from 'firebase/firestore';

export interface Equipment {
  id: string;
  name: string;
  description: string;
  location: string;
  category: string;
  createdBy: string;
  createdAt: Timestamp;
  isActive: boolean;
  critWalkInterval: number; // in hours
  expectedPhotoCount: number;
  photoGuidelines?: string;
  tags?: string[];
}

export interface EquipmentStatus {
  lastCritWalkAt: Timestamp | null;
  lastCritWalkBy: string | null;
  nextDueBy: Timestamp | null;
  status: 'green' | 'yellow' | 'red' | 'never';
  totalWalksCompleted: number;

  // Active failure tracking
  hasActiveFailure: boolean;
  activeFailureCount: number;
  lastFailureAt?: Timestamp | null;
}

export interface EquipmentFormData {
  name: string;
  description: string;
  location: string;
  category: string;
  critWalkInterval: number;
  expectedPhotoCount: number;
  photoGuidelines?: string;
}
