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
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error('Failed to read file'));

    reader.onload = (e) => {
      const img = new Image();

      img.onerror = () => reject(new Error('Failed to load image'));

      img.onload = () => {
        // Target max dimensions (good for mobile + web)
        const MAX_WIDTH = 1920;
        const MAX_HEIGHT = 1920;

        let width = img.width;
        let height = img.height;

        // Calculate new dimensions while maintaining aspect ratio
        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        // Create canvas and resize image
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        // Draw resized image
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to blob with compression (0.85 quality = good balance)
        canvas.toBlob(
          (blob) => {
            if (blob) {
              console.log(`Image compressed: ${(file.size / 1024 / 1024).toFixed(2)}MB → ${(blob.size / 1024 / 1024).toFixed(2)}MB`);
              resolve(blob);
            } else {
              reject(new Error('Failed to create blob'));
            }
          },
          'image/jpeg',
          0.85
        );
      };

      img.src = e.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
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
