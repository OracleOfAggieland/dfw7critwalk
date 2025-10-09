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
  updateDoc,
  doc,
  arrayUnion
} from 'firebase/firestore';
import { db } from './firebase';
import { CritWalk, CritWalkFormData, CritWalkPhoto, CritWalkComment } from '../types/critWalk.types';
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
      photos: [],
      hasFailure: data.hasFailure || false,
      workOrderNumber: data.workOrderNumber || null,
      failureResolvedAt: null,
      failureResolvedBy: null,
      comments: []
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
    await updateEquipmentStatus(
      data.equipmentId,
      technicianName,
      data.hasFailure || false
    );

    return critWalkRef.id;
  } catch (error) {
    console.error('Error creating crit walk:', error);
    throw new Error('Failed to create crit walk');
  }
};

const updateEquipmentStatus = async (
  equipmentId: string,
  technicianName: string,
  hasFailure: boolean = false
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
      const currentData = statusDoc.data();

      // Calculate active failure count
      let activeFailureCount = currentData.activeFailureCount || 0;
      if (hasFailure) {
        activeFailureCount += 1;
      }

      await updateDoc(statusDoc.ref, {
        lastCritWalkAt: now,
        lastCritWalkBy: technicianName,
        status: 'green',
        totalWalksCompleted: (currentData.totalWalksCompleted || 0) + 1,
        hasActiveFailure: activeFailureCount > 0,
        activeFailureCount: activeFailureCount,
        lastFailureAt: hasFailure ? now : currentData.lastFailureAt || null
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

/**
 * Update the failure status of a crit walk (mark as resolved)
 */
export const updateCritWalkFailureStatus = async (
  equipmentId: string,
  critWalkId: string,
  resolvedBy: string
): Promise<void> => {
  try {
    const critWalkRef = doc(
      db,
      EQUIPMENT_COLLECTION,
      equipmentId,
      'critWalks',
      critWalkId
    );

    await updateDoc(critWalkRef, {
      failureResolvedAt: Timestamp.now(),
      failureResolvedBy: resolvedBy
    });

    // Update equipment status - decrement active failure count
    const statusQuery = query(
      collection(db, EQUIPMENT_STATUS_COLLECTION),
      where('equipmentId', '==', equipmentId)
    );

    const statusSnapshot = await getDocs(statusQuery);

    if (!statusSnapshot.empty) {
      const statusDoc = statusSnapshot.docs[0];
      const currentData = statusDoc.data();
      const newCount = Math.max((currentData.activeFailureCount || 1) - 1, 0);

      await updateDoc(statusDoc.ref, {
        activeFailureCount: newCount,
        hasActiveFailure: newCount > 0
      });
    }

    console.log('Failure status updated successfully');
  } catch (error) {
    console.error('Error updating failure status:', error);
    throw new Error('Failed to update failure status');
  }
};

/**
 * Add a comment to a crit walk
 */
export const addCritWalkComment = async (
  equipmentId: string,
  critWalkId: string,
  commentText: string,
  createdBy: string
): Promise<void> => {
  try {
    const critWalkRef = doc(
      db,
      EQUIPMENT_COLLECTION,
      equipmentId,
      'critWalks',
      critWalkId
    );

    const comment: CritWalkComment = {
      id: `comment_${Date.now()}`,
      text: commentText,
      createdBy: createdBy,
      createdAt: Timestamp.now()
    };

    await updateDoc(critWalkRef, {
      comments: arrayUnion(comment)
    });

    console.log('Comment added successfully');
  } catch (error) {
    console.error('Error adding comment:', error);
    throw new Error('Failed to add comment');
  }
};

/**
 * Update failure details (hasFailure and workOrderNumber) - Manager only
 */
export const updateCritWalkFailureDetails = async (
  equipmentId: string,
  critWalkId: string,
  hasFailure: boolean,
  workOrderNumber: string | null
): Promise<void> => {
  try {
    const critWalkRef = doc(
      db,
      EQUIPMENT_COLLECTION,
      equipmentId,
      'critWalks',
      critWalkId
    );

    await updateDoc(critWalkRef, {
      hasFailure,
      workOrderNumber: workOrderNumber || null
    });

    // Update equipment status based on new failure state
    const statusQuery = query(
      collection(db, EQUIPMENT_STATUS_COLLECTION),
      where('equipmentId', '==', equipmentId)
    );

    const statusSnapshot = await getDocs(statusQuery);

    if (!statusSnapshot.empty) {
      const statusDoc = statusSnapshot.docs[0];

      // Recalculate active failure count by querying all crit walks
      const critWalksQuery = query(
        collection(db, EQUIPMENT_COLLECTION, equipmentId, 'critWalks')
      );
      const critWalksSnapshot = await getDocs(critWalksQuery);

      let activeCount = 0;
      critWalksSnapshot.docs.forEach(doc => {
        const data = doc.data();
        // Count unresolved failures
        if (data.hasFailure && !data.failureResolvedAt) {
          activeCount++;
        }
      });

      await updateDoc(statusDoc.ref, {
        activeFailureCount: activeCount,
        hasActiveFailure: activeCount > 0,
        lastFailureAt: hasFailure ? Timestamp.now() : statusDoc.data().lastFailureAt
      });
    }

    console.log('Failure details updated successfully');
  } catch (error) {
    console.error('Error updating failure details:', error);
    throw new Error('Failed to update failure details');
  }
};
