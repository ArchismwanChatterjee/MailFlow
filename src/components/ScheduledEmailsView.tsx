import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Mail,
  Trash2,
  RefreshCw,
  Send,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useEmailScheduling } from "../hooks/useEmailScheduling";
import { ScheduledEmail } from "../lib/supabase";

interface ScheduledEmailsViewProps {
  userEmail: string;
  accessToken?: string; // Add accessToken prop
}

export const ScheduledEmailsView: React.FC<ScheduledEmailsViewProps> = ({
  userEmail,
  accessToken,
}) => {
  const {
    scheduledEmails,
    isLoading,
    error,
    loadScheduledEmails,
    cancelScheduledEmail,
  } = useEmailScheduling();
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Auth is determined using the accessToken
  const isAuthenticated = !!accessToken && !!userEmail;
  // console.log("ScheduledEmailsView - User Email:", userEmail);

  useEffect(() => {
    if (isAuthenticated) {
      loadScheduledEmails(userEmail);
    }
  }, [userEmail, isAuthenticated, loadScheduledEmails]);

  const handleRefresh = async () => {
    if (!isAuthenticated) return;
    setIsTransitioning(true);
    await loadScheduledEmails(userEmail);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const handleCancelEmail = async (emailId: string) => {
    if (!isAuthenticated) return;
    setIsTransitioning(true);
    await cancelScheduledEmail(emailId, userEmail);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-orange-500" />;
      case "sent":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "sent":
        return "bg-green-100 text-green-800 border-green-200";
      case "failed":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const pendingEmails = scheduledEmails.filter(
    (email) => email.status === "pending"
  );
  const completedEmails = scheduledEmails.filter(
    (email) => email.status !== "pending"
  );

  if (!isAuthenticated) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:p-8">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Authentication Required
          </h3>
          <p className="text-gray-600">
            Please sign in to view scheduled emails.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-200 transition-all duration-300 ${
        isTransitioning ? "opacity-50 blur-sm" : "opacity-100 blur-0"
      }`}
    >
      <div className="flex items-center justify-between p-4 lg:p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3 min-w-0 flex-1">
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Calendar className="w-4 h-4 text-purple-600" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-semibold text-gray-900">
              Scheduled Emails
            </h2>
            <p className="text-sm text-gray-500 truncate">
              <span className="inline lg:hidden">
                {scheduledEmails.length} emails
              </span>
              <span className="hidden lg:inline">
                {scheduledEmails.length} scheduled emails
              </span>
              <span className="hidden sm:inline">
                {" "}
                • {pendingEmails.length} pending
              </span>
            </p>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 flex-shrink-0"
          title="Refresh scheduled emails"
        >
          <RefreshCw className={`w-5 h-5 ${isLoading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {error && (
        <div className="p-4 lg:p-6 border-b border-gray-200">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="divide-y divide-gray-100">
        {isLoading && scheduledEmails.length === 0 ? (
          <div className="p-6 lg:p-8 text-center">
            <RefreshCw className="w-8 h-8 animate-spin text-purple-500 mx-auto mb-4" />
            <p className="text-gray-600 text-sm lg:text-base">
              Loading scheduled emails...
            </p>
          </div>
        ) : scheduledEmails.length === 0 ? (
          <div className="p-6 lg:p-8 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No scheduled emails
            </h3>
            <p className="text-gray-600 text-sm lg:text-base">
              Schedule emails from the compose tab to see them here
            </p>
          </div>
        ) : (
          <>
            {/* Pending Emails Section */}
            {pendingEmails.length > 0 && (
              <div className="p-4 lg:p-6">
                <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-orange-500" />
                  <span>Pending ({pendingEmails.length})</span>
                </h3>
                <div className="space-y-3">
                  {pendingEmails.map((email) => (
                    <div
                      key={email.id}
                      className="bg-orange-50 border border-orange-200 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <Mail className="w-4 h-4 text-orange-600" />
                            <h4 className="text-sm font-medium text-gray-900 truncate">
                              {email.subject || "No Subject"}
                            </h4>
                          </div>
                          <p className="text-xs text-gray-600 mb-1">
                            To: {email.to_email}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>
                              Scheduled: {formatDateTime(email.scheduled_time)}
                            </span>
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full border ${getStatusColor(
                                email.status
                              )}`}
                            >
                              {getStatusIcon(email.status)}
                              <span className="ml-1 capitalize">
                                {email.status}
                              </span>
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleCancelEmail(email.id)}
                          className="ml-3 p-1 text-red-400 hover:text-red-600 hover:bg-red-100 rounded transition-colors"
                          title="Cancel scheduled email"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Completed Emails Section */}
            {completedEmails.length > 0 && (
              <div className="p-4 lg:p-6">
                <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center space-x-2">
                  <Send className="w-4 h-4 text-gray-500" />
                  <span>History ({completedEmails.length})</span>
                </h3>
                <div className="space-y-3">
                  {completedEmails.map((email) => (
                    <div
                      key={email.id}
                      className="bg-gray-50 border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <Mail className="w-4 h-4 text-gray-600" />
                            <h4 className="text-sm font-medium text-gray-900 truncate">
                              {email.subject || "No Subject"}
                            </h4>
                          </div>
                          <p className="text-xs text-gray-600 mb-1">
                            To: {email.to_email}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>
                              {email.status === "sent" && email.sent_at
                                ? `Sent: ${formatDateTime(email.sent_at)}`
                                : `Scheduled: ${formatDateTime(
                                    email.scheduled_time
                                  )}`}
                            </span>
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full border ${getStatusColor(
                                email.status
                              )}`}
                            >
                              {getStatusIcon(email.status)}
                              <span className="ml-1 capitalize">
                                {email.status}
                              </span>
                            </span>
                          </div>
                          {email.error_message && (
                            <p className="text-xs text-red-600 mt-1">
                              Error: {email.error_message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
