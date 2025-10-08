export type Role = 'manager' | 'technician';

export interface UserProfile {
  name: string;
  role: Role;
  timestamp: number;
}
