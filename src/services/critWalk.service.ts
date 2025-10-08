import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  serverTimestamp,
  updateDoc
} from 'firebase/firestore';
import { db } from './firebase';
import { CritWalk, CritWalkFormData, CritWalkPhoto } from '../types/critWalk.types';
import { uploadMultiplePhotos } from './storage.service';

const EQUIPMENT_COLLECTION = 'equipment';
const EQUIPMENT_STATUS_COLLECTION = 'equipmentStatus';

export const createCritWalk = async (
  data: CritWalkFormData,
  technicianName: string,
  equipmentName: string
): Promise<string> => {
  try {
    // Create placeholder crit walk to get ID
    const critWalkData = {
      equipmentId: data.equipmentId,
      equipmentName,
      technicianName,
      completedAt: serverTimestamp(),
      notes: data.notes || '',
      photos: []
    };

    const critWalkRef = await addDoc(
      collection(db, EQUIPMENT_COLLECTION, data.equipmentId, 'critWalks'),
      critWalkData
    );

    // Upload photos
    const photoUrls = await uploadMultiplePhotos(
      data.equipmentId,
      critWalkRef.id,
      data.photos
    );

    // Update with photo URLs
    const photos: CritWalkPhoto[] = photoUrls.map(url => ({
      storageUrl: url,
      uploadedAt: Timestamp.now()
    }));

    await updateDoc(critWalkRef, { photos });

    // Update equipment status
    await updateEquipmentStatus(data.equipmentId, technicianName);

    return critWalkRef.id;
  } catch (error) {
    console.error('Error creating crit walk:', error);
    throw new Error('Failed to create crit walk');
  }
};

const updateEquipmentStatus = async (
  equipmentId: string,
  technicianName: string
): Promise<void> => {
  try {
    const now = Timestamp.now();

    // Find status document
    const q = query(
      collection(db, EQUIPMENT_STATUS_COLLECTION),
      where('equipmentId', '==', equipmentId)
    );

    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const statusDoc = snapshot.docs[0];
      await updateDoc(statusDoc.ref, {
        lastCritWalkAt: now,
        lastCritWalkBy: technicianName,
        status: 'green',
        totalWalksCompleted: (statusDoc.data().totalWalksCompleted || 0) + 1
      });
    }
  } catch (error) {
    console.error('Error updating equipment status:', error);
  }
};

export const getCritWalksByEquipment = async (
  equipmentId: string,
  limitCount: number = 50
): Promise<CritWalk[]> => {
  try {
    const q = query(
      collection(db, EQUIPMENT_COLLECTION, equipmentId, 'critWalks'),
      orderBy('completedAt', 'desc'),
      limit(limitCount)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as CritWalk));
  } catch (error) {
    console.error('Error fetching crit walks:', error);
    return [];
  }
};
