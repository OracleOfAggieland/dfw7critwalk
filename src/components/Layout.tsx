import { ReactNode, useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/auth.service';
import { Logo } from '../assets/Logo';

interface LayoutProps {
  children: ReactNode;
  onChangeUser: () => void;
}

export function Layout({ children, onChangeUser }: LayoutProps) {
  const { userProfile } = useUser();
  const navigate = useNavigate();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleNavigateToDashboard = () => {
    navigate('/dashboard');
    setShowMobileMenu(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10 border-b-2 border-brand-gear">
        <div className="w-full px-4 py-3 flex items-center justify-between gap-4">
          {/* Left side - Logo and Title */}
          <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
            <Logo
              size="small"
              className="cursor-pointer"
              onClick={handleNavigateToDashboard}
            />
            <div className="hidden md:block">
              <h1
                className="text-xl font-bold cursor-pointer hover:text-brand-blue transition"
                onClick={handleNavigateToDashboard}
              >
                Crit Walk Dashboard
              </h1>
              <span className="text-xs text-gray-500">DFW7 RME</span>
            </div>
            {/* Mobile - Just title */}
            <div className="md:hidden">
              <h1
                className="text-lg font-bold cursor-pointer hover:text-brand-blue transition"
                onClick={handleNavigateToDashboard}
              >
                Crit Walk
              </h1>
            </div>
          </div>

          {/* Right side - Desktop: User info and buttons */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            <div className="text-right flex-shrink-0">
              <p className="font-medium text-sm whitespace-nowrap">{userProfile.name}</p>
              <span
                className={`text-xs px-2 py-0.5 rounded whitespace-nowrap ${
                  userProfile.role === 'manager'
                    ? 'bg-red-100 text-brand-red'
                    : 'bg-blue-100 text-brand-blue'
                }`}
              >
                {userProfile.role}
              </span>
            </div>

            <button
              onClick={onChangeUser}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition flex-shrink-0 whitespace-nowrap"
            >
              Change User
            </button>

            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm bg-brand-red text-white rounded-md hover:bg-brand-red-light transition flex-shrink-0 whitespace-nowrap font-medium"
              style={{ backgroundColor: '#BF0A30', minWidth: '80px' }}
            >
              Logout
            </button>
          </div>

          {/* Mobile - Hamburger menu */}
          <div className="md:hidden">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="w-11 h-11 flex items-center justify-center text-gray-700 hover:text-brand-blue transition"
              aria-label="Menu"
            >
              <span className="text-2xl">☰</span>
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {showMobileMenu && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="p-4 space-y-4">
              {/* User info */}
              <div className="pb-4 border-b border-gray-200">
                <p className="font-medium text-base">{userProfile.name}</p>
                <span
                  className={`inline-block text-sm px-3 py-1 rounded mt-1 ${
                    userProfile.role === 'manager'
                      ? 'bg-red-100 text-brand-red'
                      : 'bg-blue-100 text-brand-blue'
                  }`}
                >
                  {userProfile.role}
                </span>
              </div>

              {/* Actions */}
              <button
                onClick={() => {
                  onChangeUser();
                  setShowMobileMenu(false);
                }}
                className="w-full px-4 py-3 text-left border border-gray-300 rounded-md hover:bg-gray-50 transition min-h-[48px]"
              >
                Change User
              </button>

              <button
                onClick={() => {
                  handleLogout();
                  setShowMobileMenu(false);
                }}
                className="w-full px-4 py-3 text-left bg-brand-red text-white rounded-md hover:bg-brand-red-light transition min-h-[48px]"
                style={{ backgroundColor: '#BF0A30' }}
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>

      {/* Footer - Hidden on mobile */}
      <footer className="hidden md:block bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-4 text-center text-sm text-gray-500">
          DFW7 RME • Crit Walk Dashboard • {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
}
