import { Timestamp } from 'firebase/firestore';

export type AssignmentStatus = 'pending' | 'completed' | 'overdue';

export interface Assignment {
  id: string;
  equipmentId: string;
  equipmentName: string;
  technicianName: string;
  assignedBy: string;
  assignedAt: Timestamp;
  dueBy?: Timestamp;
  status: AssignmentStatus;
  completedAt?: Timestamp;
  critWalkId?: string;
}

export interface AssignmentFormData {
  equipmentId: string;
  technicianName: string;
  dueBy?: Date;
}
