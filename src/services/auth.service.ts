import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from './firebase';

export const loginAsTeam = async () => {
  const email = import.meta.env.VITE_TEAM_LOGIN_EMAIL;
  const password = import.meta.env.VITE_TEAM_LOGIN_PASSWORD;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    return { success: true };
  } catch (error) {
    console.error('Login failed:', error);
    return { success: false, error };
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
    localStorage.removeItem('userProfile');
    return { success: true };
  } catch (error) {
    console.error('Logout failed:', error);
    return { success: false, error };
  }
};
