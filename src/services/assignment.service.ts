import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { Assignment, AssignmentFormData } from '../types/assignment.types';

const ASSIGNMENTS_COLLECTION = 'assignments';

export const createAssignment = async (
  data: AssignmentFormData,
  assignedBy: string,
  equipmentName: string
): Promise<string> => {
  try {
    const assignmentData = {
      equipmentId: data.equipmentId,
      equipmentName,
      technicianName: data.technicianName,
      assignedBy,
      assignedAt: serverTimestamp(),
      dueBy: data.dueBy ? Timestamp.fromDate(data.dueBy) : null,
      status: 'pending' as const
    };

    const docRef = await addDoc(collection(db, ASSIGNMENTS_COLLECTION), assignmentData);
    return docRef.id;
  } catch (error) {
    console.error('Error creating assignment:', error);
    throw new Error('Failed to create assignment');
  }
};

export const getAssignmentsByTechnician = async (
  technicianName: string
): Promise<Assignment[]> => {
  try {
    const q = query(
      collection(db, ASSIGNMENTS_COLLECTION),
      where('technicianName', '==', technicianName),
      where('status', '==', 'pending'),
      orderBy('assignedAt', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Assignment));
  } catch (error) {
    console.error('Error fetching assignments:', error);
    return [];
  }
};

export const getAllAssignments = async (): Promise<Assignment[]> => {
  try {
    const q = query(
      collection(db, ASSIGNMENTS_COLLECTION),
      orderBy('assignedAt', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Assignment));
  } catch (error) {
    console.error('Error fetching all assignments:', error);
    return [];
  }
};

export const completeAssignment = async (
  assignmentId: string,
  critWalkId: string
): Promise<void> => {
  try {
    const docRef = doc(db, ASSIGNMENTS_COLLECTION, assignmentId);
    await updateDoc(docRef, {
      status: 'completed',
      completedAt: serverTimestamp(),
      critWalkId
    });
  } catch (error) {
    console.error('Error completing assignment:', error);
    throw new Error('Failed to complete assignment');
  }
};
