/**
 * DFW7 RME Crit Walk Dashboard - Cloud Functions
 *
 * Auto-cleanup function to delete crit walk photos older than 30 days
 */

import {setGlobalOptions} from "firebase-functions/v2";
import {onSchedule} from "firebase-functions/v2/scheduler";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";

// Initialize Firebase Admin SDK
admin.initializeApp();

// Set global options for cost control
setGlobalOptions({maxInstances: 10});

/**
 * Scheduled function that runs daily at midnight (UTC)
 * Deletes crit walk photos and documents older than 30 days
 */
export const cleanupOldCritWalks = onSchedule(
  {
    schedule: "0 0 * * *", // Run at midnight UTC every day
    timeZone: "America/Chicago", // Central Time (DFW7 timezone)
  },
  async (event) => {
    logger.info("Starting cleanup of crit walks older than 30 days...");

    try {
      // Calculate timestamp for 30 days ago
      const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
      const cutoffTimestamp = admin.firestore.Timestamp.fromMillis(thirtyDaysAgo);

      let deletedCount = 0;
      let photoCount = 0;

      // Get all equipment documents
      const equipmentSnapshot = await admin.firestore()
        .collection("equipment")
        .get();

      // Process each equipment's crit walks
      for (const equipDoc of equipmentSnapshot.docs) {
        const critWalksSnapshot = await equipDoc.ref
          .collection("critWalks")
          .where("completedAt", "<", cutoffTimestamp)
          .get();

        // Delete each old crit walk
        for (const walkDoc of critWalksSnapshot.docs) {
          const walkData = walkDoc.data();

          // Delete photos from Storage
          if (walkData.photos && Array.isArray(walkData.photos)) {
            for (const photo of walkData.photos) {
              try {
                const photoPath = extractPathFromUrl(photo.storageUrl);
                if (photoPath) {
                  await admin.storage().bucket().file(photoPath).delete();
                  photoCount++;
                  logger.info(`Deleted photo: ${photoPath}`);
                }
              } catch (error) {
                logger.warn(`Failed to delete photo: ${photo.storageUrl}`, error);
              }
            }
          }

          // Delete Firestore document
          await walkDoc.ref.delete();
          deletedCount++;
        }
      }

      logger.info(
        `Cleanup completed successfully! Deleted ${deletedCount} crit walks and ${photoCount} photos.`
      );
    } catch (error) {
      logger.error("Error during cleanup:", error);
      throw error;
    }
  }
);

/**
 * Extract storage path from Firebase Storage URL
 */
function extractPathFromUrl(url: string): string | null {
  try {
    // Firebase Storage URL format:
    // https://firebasestorage.googleapis.com/v0/b/{bucket}/o/{path}?alt=media...
    const match = url.match(/\/o\/(.+?)\?/);
    if (match && match[1]) {
      return decodeURIComponent(match[1]);
    }
    return null;
  } catch (error) {
    logger.warn("Failed to extract path from URL:", url, error);
    return null;
  }
}
