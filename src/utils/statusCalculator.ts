import { Timestamp } from 'firebase/firestore';

export type StatusColor = 'green' | 'yellow' | 'red' | 'never';

export const calculateStatus = (
  lastCritWalkAt: Timestamp | null,
  _critWalkInterval: number = 12
): StatusColor => {
  if (!lastCritWalkAt) return 'never';

  const now = new Date();
  const lastWalk = lastCritWalkAt.toDate();
  const hoursSince = (now.getTime() - lastWalk.getTime()) / (1000 * 60 * 60);

  if (hoursSince <= 8) return 'green';
  if (hoursSince <= 12) return 'yellow';
  return 'red';
};

export const getStatusColor = (status: StatusColor): string => {
  switch (status) {
    case 'green':
      return 'bg-status-green';
    case 'yellow':
      return 'bg-status-yellow';
    case 'red':
      return 'bg-status-red';
    case 'never':
      return 'bg-status-gray';
  }
};

export const getStatusBorderColor = (status: StatusColor): string => {
  switch (status) {
    case 'green':
      return 'border-status-green';
    case 'yellow':
      return 'border-status-yellow';
    case 'red':
      return 'border-status-red';
    case 'never':
      return 'border-status-gray';
  }
};

export const getStatusTextColor = (status: StatusColor): string => {
  switch (status) {
    case 'green':
      return 'text-green-700';
    case 'yellow':
      return 'text-yellow-700';
    case 'red':
      return 'text-red-700';
    case 'never':
      return 'text-gray-700';
  }
};

export const getStatusBgClass = (status: StatusColor): string => {
  switch (status) {
    case 'green':
      return 'bg-green-100';
    case 'yellow':
      return 'bg-yellow-100';
    case 'red':
      return 'bg-red-100';
    case 'never':
      return 'bg-gray-100';
  }
};
