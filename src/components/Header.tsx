import React, { useState } from "react";
import { Mail, User, LogOut, X } from "lucide-react";
import { UserProfile } from "../types/gmail";

interface HeaderProps {
  userProfile: UserProfile | null;
  isAuthenticated: boolean;
  onSignOut: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  userProfile,
  isAuthenticated,
  onSignOut,
}) => {
  const [showMobileModal, setShowMobileModal] = useState(false);

  // Helper to detect mobile (tailwind 'lg' breakpoint)
  const isMobile = window.matchMedia("(max-width: 1023px)").matches;

  // Close modal when clicking outside the modal box
  const handleModalBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setShowMobileModal(false);
    }
  };

  return (
    <>
      <header className="bg-white/90 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Mail className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg lg:text-xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                  Mail Flow
                </h1>
                <p className="text-xs text-gray-500 hidden sm:block">
                  Modern Gmail Client
                </p>
              </div>
            </div>

            {isAuthenticated && userProfile && (
              <div className="flex items-center space-x-2 lg:space-x-4">
                {/* User Icon: Always visible */}
                <div
                  className="flex items-center space-x-2 lg:space-x-3 bg-gray-50 rounded-full px-3 lg:px-4 py-2 cursor-pointer"
                  onClick={() => {
                    if (isMobile) setShowMobileModal(true);
                  }}
                  tabIndex={0}
                  aria-label="Show user details"
                >
                  <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-br from-teal-400 to-teal-500 rounded-full flex items-center justify-center">
                    <User className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
                  </div>
                  {/* Details: Only show inline on large screens */}
                  <div className="hidden lg:block">
                    <p className="text-xs lg:text-sm font-medium text-gray-900 truncate max-w-32 lg:max-w-none">
                      {userProfile.emailAddress}
                    </p>
                    <p className="text-xs text-gray-500">
                      {userProfile.messagesTotal
                        ? `${userProfile.messagesTotal} messages`
                        : "Gmail Connected"}
                    </p>
                  </div>
                </div>
                {/* Sign Out: Always visible on large, in modal on mobile */}
                <button
                  onClick={onSignOut}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors hidden lg:inline-flex"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4 lg:w-5 lg:h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Modal rendered outside header for proper overlay */}
      {isAuthenticated && userProfile && showMobileModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={handleModalBackdropClick}
        >
          <div
            className="bg-white rounded-xl shadow-lg p-6 w-11/12 max-w-xs relative flex flex-col items-center justify-center"
            style={{
              position: "absolute",
              top: "25%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <button
              className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600"
              onClick={() => setShowMobileModal(false)}
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex flex-col items-center space-y-3">
              <div className="w-14 h-14 bg-gradient-to-br from-teal-400 to-teal-500 rounded-full flex items-center justify-center mb-2">
                <User className="w-7 h-7 text-white" />
              </div>
              <p className="text-sm font-medium text-gray-900 text-center break-all">
                {userProfile.emailAddress}
              </p>
              <p className="text-xs text-gray-500 text-center">
                {userProfile.messagesTotal
                  ? `${userProfile.messagesTotal} messages`
                  : "Gmail Connected"}
              </p>
              <button
                onClick={() => {
                  setShowMobileModal(false);
                  onSignOut();
                }}
                className="mt-4 w-full flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg px-4 py-2 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};