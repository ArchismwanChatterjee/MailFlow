import React from "react";
import { Mail, Shield, Loader2, FileText, ExternalLink } from "lucide-react";

interface AuthCardProps {
  onSignIn: () => void;
  isLoading: boolean;
  error: string | null;
  isReady: boolean;
  onShowSecurity: () => void;
  onShowPrivacy: () => void;
}

export const AuthCard: React.FC<AuthCardProps> = ({
  onSignIn,
  isLoading,
  error,
  isReady,
  onShowSecurity,
  onShowPrivacy,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome to Mail Flow
            </h2>
            <p className="text-gray-600">
              Connect your Gmail account to get started with modern email
              management
            </p>
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
            <div className="flex items-center space-x-3 text-sm text-gray-600">
              <Shield className="w-4 h-4 text-purple-500" />
              <span>No data stored on our servers</span>
            </div>
          </div>

          <button
            onClick={onSignIn}
            disabled={!isReady || isLoading}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 mb-6"
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
            <p className="text-center text-sm text-gray-500 mb-6">
              Loading Google services...
            </p>
          )}

          {/* Policy Links */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-medium text-gray-900 mb-3 text-center">
              Privacy & Security
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={onShowSecurity}
                className="flex items-center justify-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200"
              >
                <Shield className="w-4 h-4" />
                <span>Security Policy</span>
              </button>
              <button
                onClick={onShowPrivacy}
                className="flex items-center justify-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200"
              >
                <FileText className="w-4 h-4" />
                <span>Privacy Policy</span>
              </button>
            </div>
            <p className="text-xs text-gray-500 text-center mt-3">
              Learn how we protect your data and privacy
            </p>
          </div>

          {/* Direct Links for Google Verification */}
          <div className="mt-6 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-600 text-center mb-2">
              Direct Policy Links:
            </p>
            <div className="flex justify-center space-x-4 text-xs">
              <a
                href="/privacy-policy"
                className="text-blue-600 hover:underline flex items-center space-x-1"
                onClick={(e) => {
                  e.preventDefault();
                  onShowPrivacy();
                }}
              >
                <ExternalLink className="w-3 h-3" />
                <span>Privacy Policy</span>
              </a>
              <a
                href="/security-policy"
                className="text-blue-600 hover:underline flex items-center space-x-1"
                onClick={(e) => {
                  e.preventDefault();
                  onShowSecurity();
                }}
              >
                <ExternalLink className="w-3 h-3" />
                <span>Security Policy</span>
              </a>
            </div>
          </div>

          {/* Google API Compliance Notice */}
          <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start space-x-2">
              <Shield className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-blue-800 font-medium mb-1">
                  Google API Compliance
                </p>
                <p className="text-xs text-blue-700">
                  Mail Flow adheres to Google's API Services User Data Policy,
                  including Limited Use requirements. Your data is processed
                  securely and never stored on external servers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
