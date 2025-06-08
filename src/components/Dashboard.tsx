import React, { useState } from "react";
import { Mail, Send, Inbox } from "lucide-react";
import { InboxFeed } from "./InboxFeed";
import { EmailComposer } from "./EmailComposer";

type TabType = "inbox" | "compose";

export const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("inbox");

  const tabs = [
    { id: "inbox" as TabType, label: "Inbox", icon: Inbox },
    { id: "compose" as TabType, label: "Compose", icon: Send },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <nav className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="space-y-2">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </nav>

            {/* Quick Stats */}
            <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                Quick Stats
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Connected
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Service</span>
                  <span className="text-sm font-medium text-gray-900">
                    Gmail API
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === "inbox" && <InboxFeed />}
            {activeTab === "compose" && <EmailComposer />}
          </div>
        </div>
      </div>
    </div>
  );
};
