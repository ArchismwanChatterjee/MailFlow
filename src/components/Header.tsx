import React from 'react';
import { Mail, User, LogOut } from 'lucide-react';
import { UserProfile } from '../types/gmail';

interface HeaderProps {
  userProfile: UserProfile | null;
  isAuthenticated: boolean;
  onSignOut: () => void;
}

export const Header: React.FC<HeaderProps> = ({ userProfile, isAuthenticated, onSignOut }) => {
  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                Mail Flow
              </h1>
              <p className="text-xs text-gray-500">Modern Gmail Client</p>
            </div>
          </div>

          {isAuthenticated && userProfile && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3 bg-gray-50 rounded-full px-4 py-2">
                <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-teal-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{userProfile.emailAddress}</p>
                  <p className="text-xs text-gray-500">
                    {userProfile.messagesTotal ? `${userProfile.messagesTotal} messages` : 'Gmail Connected'}
                  </p>
                </div>
              </div>
              <button
                onClick={onSignOut}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};