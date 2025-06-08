import React from 'react';
import { Mail, Shield, Loader2 } from 'lucide-react';

interface AuthCardProps {
  onSignIn: () => void;
  isLoading: boolean;
  error: string | null;
  isReady: boolean;
}

export const AuthCard: React.FC<AuthCardProps> = ({ onSignIn, isLoading, error, isReady }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Mail Flow</h2>
            <p className="text-gray-600">Connect your Gmail account to get started with modern email management</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-4 mb-6">
            <div className="flex items-center space-x-3 text-sm text-gray-600">
              <Shield className="w-4 h-4 text-green-500" />
              <span>Secure OAuth 2.0 authentication</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-600">
              <Mail className="w-4 h-4 text-blue-500" />
              <span>Read, compose, and manage emails</span>
            </div>
          </div>

          <button
            onClick={onSignIn}
            disabled={!isReady || isLoading}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Mail className="w-5 h-5" />
                <span>Connect with Gmail</span>
              </>
            )}
          </button>

          {!isReady && (
            <p className="text-center text-sm text-gray-500 mt-4">
              Loading Google services...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};