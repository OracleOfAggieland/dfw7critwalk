import { useState } from 'react';
import { TEAM_MEMBERS } from '../data/teamMembers';
import { UserProfile, Role } from '../types/user.types';
import { Logo } from '../assets/Logo';

interface UserSelectionProps {
  onUserSelected: (profile: UserProfile) => void;
}

export function UserSelection({ onUserSelected }: UserSelectionProps) {
  const [selectedName, setSelectedName] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role | ''>('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMembers = TEAM_MEMBERS.filter(name =>
    name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleContinue = () => {
    if (selectedName && selectedRole) {
      const profile: UserProfile = {
        name: selectedName,
        role: selectedRole,
        timestamp: Date.now()
      };

      localStorage.setItem('userProfile', JSON.stringify(profile));
      onUserSelected(profile);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 max-w-md w-full">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <Logo size="large" />
        </div>

        <h1 className="text-2xl font-bold mb-2 text-center">Welcome to Crit Walk Dashboard</h1>
        <p className="text-gray-600 mb-6 text-center">Select your name and role to continue</p>

        {/* Name Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Name
          </label>
          <input
            type="text"
            placeholder="Search for your name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field mb-2 text-base"
            autoFocus
          />
          <div className="border border-gray-300 rounded-md max-h-60 overflow-y-auto">
            {filteredMembers.length === 0 ? (
              <div className="px-3 py-4 text-gray-500 text-sm">No members found</div>
            ) : (
              filteredMembers.map((name) => (
                <button
                  key={name}
                  onClick={() => {
                    setSelectedName(name);
                    setSearchTerm(name);
                  }}
                  className={`w-full text-left px-3 py-3 md:py-2 hover:bg-blue-50 transition min-h-[48px] md:min-h-0 ${
                    selectedName === name ? 'bg-blue-100 font-medium' : ''
                  }`}
                >
                  {name}
                </button>
              ))
            )}
          </div>
          {selectedName && (
            <p className="mt-2 text-sm text-green-600">
              Selected: <strong>{selectedName}</strong>
            </p>
          )}
        </div>

        {/* Role Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Role
          </label>
          <div className="space-y-3">
            <button
              onClick={() => setSelectedRole('technician')}
              className={`w-full px-4 py-4 md:py-3 border rounded-md text-left transition min-h-[80px] md:min-h-0 ${
                selectedRole === 'technician'
                  ? 'border-brand-blue bg-blue-50 font-medium'
                  : 'border-gray-300 hover:border-blue-300'
              }`}
            >
              <div className="font-medium text-lg md:text-base">Technician</div>
              <div className="text-sm text-gray-600">
                Complete crit walks, upload photos, add notes
              </div>
            </button>
            <button
              onClick={() => setSelectedRole('manager')}
              className={`w-full px-4 py-4 md:py-3 border rounded-md text-left transition min-h-[80px] md:min-h-0 ${
                selectedRole === 'manager'
                  ? 'border-brand-red bg-red-50 font-medium'
                  : 'border-gray-300 hover:border-red-300'
              }`}
            >
              <div className="font-medium text-lg md:text-base">Manager</div>
              <div className="text-sm text-gray-600">
                Create equipment, assign tasks, view all crit walks
              </div>
            </button>
          </div>
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          disabled={!selectedName || !selectedRole}
          className={`btn-primary w-full min-h-[56px] text-lg ${!selectedName || !selectedRole ? 'opacity-50' : ''}`}
        >
          Continue to Dashboard
        </button>

        <p className="mt-4 text-xs text-gray-500 text-center">
          {TEAM_MEMBERS.length} team members • DFW7 RME
        </p>
      </div>
    </div>
  );
}
