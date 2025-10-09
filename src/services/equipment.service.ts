import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { Equipment, EquipmentFormData, EquipmentStatus } from '../types/equipment.types';

const EQUIPMENT_COLLECTION = 'equipment';
const EQUIPMENT_STATUS_COLLECTION = 'equipmentStatus';

export const createEquipment = async (
  data: EquipmentFormData,
  createdBy: string
): Promise<string> => {
  try {
    const equipmentData = {
      ...data,
      createdBy,
      createdAt: serverTimestamp(),
      isActive: true
    };

    const docRef = await addDoc(collection(db, EQUIPMENT_COLLECTION), equipmentData);

    // Initialize equipment status
    await addDoc(collection(db, EQUIPMENT_STATUS_COLLECTION), {
      equipmentId: docRef.id,
      lastCritWalkAt: null,
      lastCritWalkBy: null,
      nextDueBy: null,
      status: 'never',
      totalWalksCompleted: 0,
      hasActiveFailure: false,
      activeFailureCount: 0,
      lastFailureAt: null
    });

    return docRef.id;
  } catch (error) {
    console.error('Error creating equipment:', error);
    throw new Error('Failed to create equipment');
  }
};

export const getAllEquipment = async (): Promise<Equipment[]> => {
  try {
    const q = query(
      collection(db, EQUIPMENT_COLLECTION),
      where('isActive', '==', true),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Equipment));
  } catch (error) {
    console.error('Error fetching equipment:', error);
    throw new Error('Failed to fetch equipment');
  }
};

export const getEquipmentById = async (id: string): Promise<Equipment | null> => {
  try {
    const docRef = doc(db, EQUIPMENT_COLLECTION, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Equipment;
    }
    return null;
  } catch (error) {
    console.error('Error fetching equipment:', error);
    throw new Error('Failed to fetch equipment');
  }
};

export const updateEquipment = async (
  id: string,
  data: Partial<EquipmentFormData>
): Promise<void> => {
  try {
    const docRef = doc(db, EQUIPMENT_COLLECTION, id);
    await updateDoc(docRef, data);
  } catch (error) {
    console.error('Error updating equipment:', error);
    throw new Error('Failed to update equipment');
  }
};

export const deleteEquipment = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, EQUIPMENT_COLLECTION, id);
    await updateDoc(docRef, { isActive: false });
  } catch (error) {
    console.error('Error deleting equipment:', error);
    throw new Error('Failed to delete equipment');
  }
};

export const getEquipmentStatus = async (equipmentId: string): Promise<EquipmentStatus | null> => {
  try {
    const q = query(
      collection(db, EQUIPMENT_STATUS_COLLECTION),
      where('equipmentId', '==', equipmentId)
    );

    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;

    return snapshot.docs[0].data() as EquipmentStatus;
  } catch (error) {
    console.error('Error fetching equipment status:', error);
    return null;
  }
};

export const getAllEquipmentStatuses = async (): Promise<Map<string, EquipmentStatus>> => {
  try {
    const snapshot = await getDocs(collection(db, EQUIPMENT_STATUS_COLLECTION));
    const statusMap = new Map<string, EquipmentStatus>();

    snapshot.docs.forEach(doc => {
      const data = doc.data() as EquipmentStatus & { equipmentId: string };
      statusMap.set(data.equipmentId, data);
    });

    return statusMap;
  } catch (error) {
    console.error('Error fetching equipment statuses:', error);
    return new Map();
  }
};
