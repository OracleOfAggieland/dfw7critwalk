import { Timestamp } from 'firebase/firestore';

export interface CritWalkPhoto {
  storageUrl: string;
  thumbnailUrl?: string;
  uploadedAt: Timestamp;
}

export interface CritWalkComment {
  id: string;
  text: string;
  createdBy: string;
  createdAt: Timestamp;
}

export interface CritWalk {
  id: string;
  equipmentId: string;
  equipmentName: string;
  technicianName: string;
  completedAt: Timestamp;
  notes?: string;
  photos: CritWalkPhoto[];

  // Failure tracking
  hasFailure: boolean;
  workOrderNumber?: string;
  failureResolvedAt?: Timestamp | null;
  failureResolvedBy?: string;

  // Comments/discussion
  comments?: CritWalkComment[];
}

export interface CritWalkFormData {
  equipmentId: string;
  notes?: string;
  photos: File[];
  hasFailure?: boolean;
  workOrderNumber?: string;
}
