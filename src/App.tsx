import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './services/firebase';
import { UserProfile } from './types/user.types';
import { UserProvider } from './contexts/UserContext';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { UserSelection } from './components/UserSelection';
import { Dashboard } from './pages/Dashboard';
import { EquipmentDetail } from './pages/EquipmentDetail';
import { LoadingSpinner } from './components/common/LoadingSpinner';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);

      // Load userProfile from localStorage if authenticated
      if (user) {
        const storedProfile = localStorage.getItem('userProfile');
        if (storedProfile) {
          try {
            const profile = JSON.parse(storedProfile) as UserProfile;
            setUserProfile(profile);
          } catch (error) {
            console.error('Failed to parse user profile:', error);
            localStorage.removeItem('userProfile');
          }
        }
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Handle user selection from UserSelection component
  const handleUserSelected = (profile: UserProfile) => {
    setUserProfile(profile);
  };

  // Handle change user action from Layout
  const handleChangeUser = () => {
    localStorage.removeItem('userProfile');
    setUserProfile(null);
  };

  // Show loading spinner during auth check
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Not authenticated → Login page */}
        {!isAuthenticated && (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        )}

        {/* Authenticated, no profile → User selection */}
        {isAuthenticated && !userProfile && (
          <>
            <Route
              path="/select-user"
              element={<UserSelection onUserSelected={handleUserSelected} />}
            />
            <Route path="*" element={<Navigate to="/select-user" replace />} />
          </>
        )}

        {/* Authenticated with profile → Dashboard/Equipment routes */}
        {isAuthenticated && userProfile && (
          <Route
            element={
              <UserProvider userProfile={userProfile}>
                <Layout onChangeUser={handleChangeUser}>
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/equipment/:id" element={<EquipmentDetail />} />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                  </Routes>
                </Layout>
              </UserProvider>
            }
            path="*"
          />
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
