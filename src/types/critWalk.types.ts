import { Timestamp } from 'firebase/firestore';

export interface CritWalkPhoto {
  storageUrl: string;
  thumbnailUrl?: string;
  uploadedAt: Timestamp;
}

export interface CritWalk {
  id: string;
  equipmentId: string;
  equipmentName: string;
  technicianName: string;
  completedAt: Timestamp;
  notes?: string;
  photos: CritWalkPhoto[];
}

export interface CritWalkFormData {
  equipmentId: string;
  notes?: string;
  photos: File[];
}
