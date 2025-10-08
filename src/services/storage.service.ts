import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

export const uploadPhoto = async (
  equipmentId: string,
  critWalkId: string,
  photo: File,
  index: number
): Promise<string> => {
  try {
    const timestamp = Date.now();
    const fileName = `${timestamp}_${index}.jpg`;
    const storageRef = ref(
      storage,
      `equipment/${equipmentId}/critwalks/${critWalkId}/${fileName}`
    );

    // Compress/resize image if needed (optional for prototype)
    const optimizedPhoto = await optimizeImage(photo);

    await uploadBytes(storageRef, optimizedPhoto);
    const downloadUrl = await getDownloadURL(storageRef);

    return downloadUrl;
  } catch (error) {
    console.error('Error uploading photo:', error);
    throw new Error('Failed to upload photo');
  }
};

const optimizeImage = async (file: File): Promise<Blob> => {
  // For prototype, return as-is
  // Future: Add image compression/resizing
  return file;
};

export const uploadMultiplePhotos = async (
  equipmentId: string,
  critWalkId: string,
  photos: File[]
): Promise<string[]> => {
  try {
    const uploadPromises = photos.map((photo, index) =>
      uploadPhoto(equipmentId, critWalkId, photo, index)
    );

    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('Error uploading photos:', error);
    throw new Error('Failed to upload photos');
  }
};
