import { formatDistanceToNow, format } from 'date-fns';
import { Timestamp } from 'firebase/firestore';

export const formatTimestamp = (timestamp: Timestamp | null): string => {
  if (!timestamp) return 'Never';
  return format(timestamp.toDate(), 'MMM dd, yyyy h:mm a');
};

export const formatTimeAgo = (timestamp: Timestamp | null): string => {
  if (!timestamp) return 'Never';
  return formatDistanceToNow(timestamp.toDate(), { addSuffix: true });
};

export const getHoursSince = (timestamp: Timestamp | null): number => {
  if (!timestamp) return Infinity;
  const now = new Date();
  const date = timestamp.toDate();
  return (now.getTime() - date.getTime()) / (1000 * 60 * 60);
};
