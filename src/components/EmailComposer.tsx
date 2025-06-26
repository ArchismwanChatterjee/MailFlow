import React, { useState } from "react";
import {
  Send,
  Save,
  Mail,
  Loader2,
  CheckCircle,
  AlertCircle,
  Clock,
  Zap,
  Calendar,
  Sparkles,
  Mic,
  Shield,
  Eye,
} from "lucide-react";
import { EmailDraft } from "../types/gmail";
import { useGmailApi } from "../hooks/useGmailApi";
import { useEmailScheduling } from "../hooks/useEmailScheduling";
import { EmailTemplates } from "./EmailTemplates";
import { SmartScheduler } from "./SmartScheduler";
import { AIEmailAssistant } from "./AIEmailAssistant";
import { ToneAnalyzer } from "./ToneAnalyzer";
import { SecurityScanner } from "./SecurityScanner";
import { VoiceToEmail } from "./VoiceToEmail";

interface AuthState {
  userEmail: string;
  accessToken: string;
  isAuthenticated: boolean;
}

interface EmailComposerProps {
  authState: AuthState;
}

export const EmailComposer: React.FC<EmailComposerProps> = ({ authState }) => {
  const [draft, setDraft] = useState<EmailDraft>({
    to: "",
    subject: "",
    body: "",
  });
  const [status, setStatus] = useState<
    "idle" | "sending" | "sent" | "saved" | "scheduled" | "error"
  >("idle");
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [isTransitioning, setIsTransitioning] = useState(false);

  const [showTemplates, setShowTemplates] = useState(false);

  const [showScheduler, setShowScheduler] = useState(false);
  const [scheduledTime, setScheduledTime] = useState<Date | null>(null);

  const [showAIAssistant, setShowAIAssistant] = useState(false);

  const { sendEmail, createDraft, isLoading } = useGmailApi();
  const { scheduleEmail, isLoading: isScheduling } = useEmailScheduling();

  const [showToneAnalyzer, setShowToneAnalyzer] = useState(false);
  const [showSecurityScanner, setShowSecurityScanner] = useState(false);
  const [showVoiceInput, setShowVoiceInput] = useState(false);
  const [securityWarnings, setSecurityWarnings] = useState<string[]>([]);

  const handleSend = async () => {
    if (!draft.to || !draft.subject) {
      setStatus("error");
      setStatusMessage("Please fill in recipient and subject fields");
      return;
    }

    // Check for security warnings before sending
    if (securityWarnings.length > 0) {
      const proceed = confirm(
        `Security warnings detected:\n${securityWarnings.join(
          "\n"
        )}\n\nDo you want to proceed anyway?`
      );
      if (!proceed) return;
    }

    setIsTransitioning(true);

    if (scheduledTime) {
      // Schedule the email using Supabase Edge Functions
      if (!authState.userEmail) {
        setStatus("error");
        setStatusMessage("Please sign in to schedule emails");
        setIsTransitioning(false);
        return;
      }

      if (!authState.accessToken) {
        setStatus("error");
        setStatusMessage(
          "Authentication token not available. Please try signing out and back in."
        );
        setIsTransitioning(false);
        return;
      }

      setStatus("sending");
      const success = await scheduleEmail(
        draft.to,
        draft.subject,
        draft.body,
        scheduledTime,
        authState.userEmail,
        authState.accessToken
      );

      if (success) {
        setStatus("scheduled");
        setStatusMessage(
          `Email scheduled for ${scheduledTime.toLocaleString()}`
        );
        setDraft({ to: "", subject: "", body: "" });
        setScheduledTime(null);
        setSecurityWarnings([]);
      } else {
        setStatus("error");
        setStatusMessage(
          "Failed to schedule email. Please check your connection and try again."
        );
      }
    } else {
      // Send immediately
      setStatus("sending");
      const result = await sendEmail(draft);
      if (result) {
        setStatus("sent");
        setStatusMessage("Email sent successfully!");
        setDraft({ to: "", subject: "", body: "" });
        setSecurityWarnings([]);
      } else {
        setStatus("error");
        setStatusMessage("Failed to send email");
      }
    }

    setIsTransitioning(false);
    setTimeout(() => setStatus("idle"), 3000);
  };

  const handleSaveDraft = async () => {
    if (!draft.to || !draft.subject) {
      setStatus("error");
      setStatusMessage("Please fill in recipient and subject fields");
      return;
    }

    setIsTransitioning(true);
    const result = await createDraft(draft);

    if (result) {
      setStatus("saved");
      setStatusMessage("Draft saved successfully!");
    } else {
      setStatus("error");
      setStatusMessage("Failed to save draft");
    }

    setIsTransitioning(false);
    setTimeout(() => setStatus("idle"), 3000);
  };

  const handleTemplateSelect = (template: {
    subject: string;
    body: string;
  }) => {
    setDraft((prev) => ({
      ...prev,
      subject: template.subject,
      body: template.body,
    }));
    setShowTemplates(false);
  };

  const handleScheduleSelect = (date: Date) => {
    setScheduledTime(date);
    setShowScheduler(false);
  };

  const handleAIAssist = (suggestion: { subject?: string; body?: string }) => {
    setDraft((prev) => ({
      ...prev,
      ...(suggestion.subject && { subject: suggestion.subject }),
      ...(suggestion.body && { body: suggestion.body }),
    }));
    setShowAIAssistant(false);
  };

  const handleVoiceInput = (
    transcription: string,
    type: "subject" | "body"
  ) => {
    setDraft((prev) => ({
      ...prev,
      [type]: type === "body" ? prev.body + transcription : transcription,
    }));
    setShowVoiceInput(false);
  };

  const getStatusIcon = () => {
    switch (status) {
      case "sending":
        return <Loader2 className="w-4 h-4 animate-spin" />;
      case "sent":
      case "saved":
      case "scheduled":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "sent":
      case "saved":
      case "scheduled":
        return "text-green-600";
      case "error":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const isProcessing = isLoading || isScheduling;

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-200 transition-all duration-300 ${
        isTransitioning ? "opacity-50 blur-sm" : "opacity-100 blur-0"
      }`}
    >
      <div className="flex items-center space-x-3 p-4 lg:p-6 border-b border-gray-200">
        <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
          <Mail className="w-4 h-4 text-teal-600" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-semibold text-gray-900">
            Smart Email Composer
          </h2>
          <p className="text-sm text-gray-500">
            Create and send emails with intelligent features
          </p>
        </div>
        {/* Auth Status Indicator */}
        <div
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            authState.isAuthenticated
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {authState.isAuthenticated ? "Fully Authenticated" : "Limited Access"}
        </div>
      </div>

      {/* Smart Features Bar */}
      <div className="p-4 lg:p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-teal-50">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowAIAssistant(!showAIAssistant)}
            className="flex items-center space-x-2 px-3 py-2 bg-white border border-purple-200 text-purple-700 rounded-lg hover:bg-purple-50 transition-colors text-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Assistant</span>
          </button>
          <button
            onClick={() => setShowToneAnalyzer(!showToneAnalyzer)}
            className="flex items-center space-x-2 px-3 py-2 bg-white border border-indigo-200 text-indigo-700 rounded-lg hover:bg-indigo-50 transition-colors text-sm"
          >
            <Eye className="w-4 h-4" />
            <span>Tone Analysis</span>
          </button>
          <button
            onClick={() => setShowSecurityScanner(!showSecurityScanner)}
            className="flex items-center space-x-2 px-3 py-2 bg-white border border-red-200 text-red-700 rounded-lg hover:bg-red-50 transition-colors text-sm"
          >
            <Shield className="w-4 h-4" />
            <span>Security Check</span>
          </button>
          <button
            onClick={() => setShowVoiceInput(!showVoiceInput)}
            className="flex items-center space-x-2 px-3 py-2 bg-white border border-green-200 text-green-700 rounded-lg hover:bg-green-50 transition-colors text-sm"
          >
            <Mic className="w-4 h-4" />
            <span>Voice Input</span>
          </button>
          <button
            onClick={() => setShowTemplates(!showTemplates)}
            className="flex items-center space-x-2 px-3 py-2 bg-white border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors text-sm"
          >
            <Zap className="w-4 h-4" />
            <span>Smart Templates</span>
          </button>
          <button
            onClick={() => setShowScheduler(!showScheduler)}
            disabled={!authState.isAuthenticated}
            className={`flex items-center space-x-2 px-3 py-2 bg-white border rounded-lg transition-colors text-sm ${
              authState.isAuthenticated
                ? "border-purple-200 text-purple-700 hover:bg-purple-50"
                : "border-gray-200 text-gray-400 cursor-not-allowed"
            }`}
            title={
              !authState.isAuthenticated
                ? "Full authentication required for scheduling"
                : "Schedule Send"
            }
          >
            <Calendar className="w-4 h-4" />
            <span>Schedule Send</span>
          </button>
          {scheduledTime && (
            <div className="flex items-center space-x-2 px-3 py-2 bg-purple-100 border border-purple-200 text-purple-800 rounded-lg text-sm">
              <Clock className="w-4 h-4" />
              <span>Scheduled: {scheduledTime.toLocaleString()}</span>
              <button
                onClick={() => setScheduledTime(null)}
                className="ml-1 text-purple-600 hover:text-purple-800"
              >
                ×
              </button>
            </div>
          )}
        </div>

        {/* Security Warnings */}
        {securityWarnings.length > 0 && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <Shield className="w-4 h-4 text-red-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-red-800 font-medium">
                  Security Warnings Detected
                </p>
                <ul className="text-xs text-red-700 mt-1 space-y-1">
                  {securityWarnings.map((warning, index) => (
                    <li key={index}>• {warning}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Authentication Warning */}
        {!authState.isAuthenticated && (
          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-yellow-600" />
              <div className="flex-1">
                <p className="text-sm text-yellow-800 font-medium">
                  Limited Authentication Detected
                </p>
                <p className="text-xs text-yellow-700 mt-1">
                  {!authState.userEmail
                    ? "Please sign in to enable all email features including scheduling."
                    : "Authentication token missing. Try signing out and back in to enable scheduling."}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* AI Assistant Panel */}
      {showAIAssistant && (
        <div className="border-b border-gray-100">
          <AIEmailAssistant
            currentDraft={draft}
            onSuggestion={handleAIAssist}
          />
        </div>
      )}

      {/* Tone Analyzer Panel */}
      {showToneAnalyzer && (
        <div className="border-b border-gray-100">
          <ToneAnalyzer
            emailContent={draft}
            onSuggestion={(suggestion) =>
              setDraft((prev) => ({ ...prev, ...suggestion }))
            }
          />
        </div>
      )}

      {/* Security Scanner Panel */}
      {showSecurityScanner && (
        <div className="border-b border-gray-100">
          <SecurityScanner
            emailContent={draft}
            onWarningsUpdate={setSecurityWarnings}
          />
        </div>
      )}

      {/* Voice Input Panel */}
      {showVoiceInput && (
        <div className="border-b border-gray-100">
          <VoiceToEmail onTranscription={handleVoiceInput} />
        </div>
      )}

      {/* Templates Panel */}
      {showTemplates && (
        <div className="border-b border-gray-100">
          <EmailTemplates onSelectTemplate={handleTemplateSelect} />
        </div>
      )}

      {/* Scheduler Panel */}
      {showScheduler && authState.isAuthenticated && (
        <div className="border-b border-gray-100">
          <SmartScheduler onSchedule={handleScheduleSelect} />
        </div>
      )}

      <div className="p-4 lg:p-6 space-y-4">
        <div>
          <label
            htmlFor="to"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            To
          </label>
          <input
            type="email"
            id="to"
            value={draft.to}
            onChange={(e) => setDraft({ ...draft, to: e.target.value })}
            placeholder="recipient@example.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm lg:text-base"
            required
          />
        </div>

        <div>
          <label
            htmlFor="subject"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Subject
          </label>
          <input
            type="text"
            id="subject"
            value={draft.subject}
            onChange={(e) => setDraft({ ...draft, subject: e.target.value })}
            placeholder="Enter email subject"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm lg:text-base"
            required
          />
        </div>

        <div>
          <label
            htmlFor="body"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Message
          </label>
          <textarea
            id="body"
            value={draft.body}
            onChange={(e) => setDraft({ ...draft, body: e.target.value })}
            placeholder="Write your message here..."
            rows={8}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-sm lg:text-base"
          />
        </div>

        {status !== "idle" && statusMessage && (
          <div
            className={`flex items-center space-x-2 text-sm ${getStatusColor()}`}
          >
            {getStatusIcon()}
            <span>{statusMessage}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
          <button
            onClick={handleSend}
            disabled={isProcessing || status === "sending"}
            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 text-sm lg:text-base"
          >
            {status === "sending" ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : scheduledTime ? (
              <Calendar className="w-5 h-5" />
            ) : (
              <Send className="w-5 h-5" />
            )}
            <span>
              {status === "sending"
                ? "Processing..."
                : scheduledTime
                ? "Schedule Email"
                : "Send Email"}
            </span>
          </button>

          <button
            onClick={handleSaveDraft}
            disabled={isProcessing}
            className="sm:flex-shrink-0 px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center justify-center space-x-2 text-sm lg:text-base"
          >
            <Save className="w-5 h-5" />
            <span>Save Draft</span>
          </button>
        </div>
      </div>
    </div>
  );
};
