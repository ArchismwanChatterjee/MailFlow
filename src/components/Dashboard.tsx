import React, { useState } from "react";
import {
  Mail,
  Send,
  Inbox,
  Calendar,
  BarChart3,
  Search,
  Zap,
} from "lucide-react";
import { InboxFeed } from "./InboxFeed";
import { EmailComposer } from "./EmailComposer";
import { ScheduledEmailsView } from "./ScheduledEmailsView";
import { EmailAnalytics } from "./EmailAnalytics";
import { SmartSearch } from "./SmartSearch";
import { useGmailAuth } from "../hooks/useGmailAuth";

type TabType = "inbox" | "compose" | "scheduled" | "analytics" | "search";

export const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("inbox");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { userProfile, isAuthenticated } = useGmailAuth();

  // console.log("User Profile:", userProfile);
  // console.log("Is Authenticated:", isAuthenticated);

  const handleTabChange = (newTab: TabType) => {
    if (newTab === activeTab) return;

    setIsTransitioning(true);
    setTimeout(() => {
      setActiveTab(newTab);
      setIsTransitioning(false);
    }, 150);
  };

  const tabs = [
    { id: "inbox" as TabType, label: "Inbox", icon: Inbox, color: "blue" },
    { id: "compose" as TabType, label: "Compose", icon: Send, color: "teal" },
    {
      id: "scheduled" as TabType,
      label: "Scheduled",
      icon: Calendar,
      color: "purple",
    },
    {
      id: "search" as TabType,
      label: "Smart Search",
      icon: Search,
      color: "orange",
    },
    {
      id: "analytics" as TabType,
      label: "Analytics",
      icon: BarChart3,
      color: "green",
    },
  ];

  // Get access token for scheduling - Fixed implementation
  const getAccessToken = (): string => {
    try {
      const token = window.gapi?.client?.getToken();
      if (token && token.access_token) {
        return token.access_token;
      }
      console.warn("No access token available");
      return "";
    } catch (error) {
      console.error("Error getting access token:", error);
      return "";
    }
  };

  // Get current authentication state - now determined by accessToken only
  const getAuthState = () => {
    const accessToken = getAccessToken();
    return {
      userEmail: sessionStorage.getItem("emailAddress") || "",
      accessToken,
      isAuthenticated: !!accessToken, // Auth is determined using the accessToken only
    };
  };

  const getTabColorClasses = (tabId: TabType, color: string) => {
    const isActive = activeTab === tabId;
    const colorMap = {
      blue: isActive
        ? "bg-blue-50 text-blue-700 border-blue-200"
        : "text-gray-600 hover:bg-blue-50 hover:text-blue-700",
      teal: isActive
        ? "bg-teal-50 text-teal-700 border-teal-200"
        : "text-gray-600 hover:bg-teal-50 hover:text-teal-700",
      purple: isActive
        ? "bg-purple-50 text-purple-700 border-purple-200"
        : "text-gray-600 hover:bg-purple-50 hover:text-purple-700",
      orange: isActive
        ? "bg-orange-50 text-orange-700 border-orange-200"
        : "text-gray-600 hover:bg-orange-50 hover:text-orange-700",
      green: isActive
        ? "bg-green-50 text-green-700 border-green-200"
        : "text-gray-600 hover:bg-green-50 hover:text-green-700",
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  // console.log("Auth State:", getAuthState());

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
          {/* Mobile Navigation */}
          <div className="lg:hidden">
            <nav className="bg-white rounded-xl shadow-sm border border-gray-200 p-3">
              <div className="flex space-x-2">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      disabled={isTransitioning}
                      className={`flex-shrink-0 flex items-center justify-center space-x-1 px-2 py-2 rounded-lg transition-all duration-200 text-xs ${getTabColorClasses(
                        tab.id,
                        tab.color
                      )} ${activeTab === tab.id ? "border" : ""} ${
                        isTransitioning ? "opacity-50" : ""
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span className="text-sm font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </nav>
          </div>

          {/* Desktop Sidebar */}
          <div className="hidden lg:block lg:w-64 flex-shrink-0">
            <nav className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="space-y-2">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      disabled={isTransitioning}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${getTabColorClasses(
                        tab.id,
                        tab.color
                      )} ${activeTab === tab.id ? "border" : ""} ${
                        isTransitioning ? "opacity-50" : ""
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </nav>

            {/* Quick Stats - Desktop Only */}
            <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                Quick Stats
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      getAuthState().isAuthenticated
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {getAuthState().isAuthenticated
                      ? "Connected"
                      : "Partial Auth"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Service</span>
                  <span className="text-sm font-medium text-gray-900">
                    Gmail API
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Features</span>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      getAuthState().isAuthenticated
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {getAuthState().isAuthenticated
                      ? "Smart Scheduling"
                      : "Limited"}
                  </span>
                </div>
              </div>
            </div>

            {/* Enhanced Stats - Desktop Only */}
            <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center space-x-2">
                <Zap className="w-4 h-4 text-blue-500" />
                <span>Smart Features</span>
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">AI Features</span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Analytics</span>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      getAuthState().isAuthenticated
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {getAuthState().isAuthenticated ? "Real-time" : "Limited"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Search</span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                    Enhanced
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-gradient-to-br from-blue-50 to-teal-50 rounded-xl border border-blue-200 p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                ✨ New Features
              </h3>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Smart email analytics & insights</li>
                <li>• Advanced search with filters</li>
                <li>• AI-powered email suggestions</li>
                <li>• Real-time performance metrics</li>
              </ul>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div
              className={`transition-all duration-300 ${
                isTransitioning
                  ? "opacity-0 blur-sm scale-95"
                  : "opacity-100 blur-0 scale-100"
              }`}
            >
              {activeTab === "inbox" && <InboxFeed />}
              {activeTab === "compose" && (
                <EmailComposer authState={getAuthState()} />
              )}
              {activeTab === "scheduled" && (
                <ScheduledEmailsView
                  userEmail={getAuthState().userEmail}
                  accessToken={getAuthState().accessToken} // <-- Pass accessToken here
                />
              )}
              {activeTab === "search" && (
                <SmartSearch authState={getAuthState()} />
              )}
              {activeTab === "analytics" && (
                <EmailAnalytics authState={getAuthState()} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
