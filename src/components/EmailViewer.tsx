import React from "react";
import { ArrowLeft, Mail, Clock, User, Tag } from "lucide-react";
import { GmailMessage } from "../types/gmail";

interface EmailViewerProps {
  message: GmailMessage;
  onBack: () => void;
}

export const EmailViewer: React.FC<EmailViewerProps> = ({
  message,
  onBack,
}) => {
  const getMessageSubject = (): string => {
    const subjectHeader = message.payload?.headers?.find(
      (h) => h.name.toLowerCase() === "subject"
    );
    return subjectHeader?.value || "No Subject";
  };

  const getMessageSender = (): string => {
    const fromHeader = message.payload?.headers?.find(
      (h) => h.name.toLowerCase() === "from"
    );
    return fromHeader?.value || "Unknown Sender";
  };

  const getMessageDate = (): string => {
    if (!message.internalDate) return "Unknown Date";
    const date = new Date(parseInt(message.internalDate));
    return date.toLocaleString();
  };

  const getMessageBody = (): string => {
    if (!message.payload) return message.snippet || "No content available";

    const getBodyFromPart = (part: any): string => {
      if (part.body?.data) {
        try {
          return atob(part.body.data.replace(/-/g, "+").replace(/_/g, "/"));
        } catch (e) {
          return "";
        }
      }
      return "";
    };

    if (message.payload.parts) {
      // Prefer text/html part
      const htmlPart = message.payload.parts.find(
        (part) => part.mimeType === "text/html"
      );
      if (htmlPart) {
        const htmlContent = getBodyFromPart(htmlPart);
        if (htmlContent) {
          return htmlContent; // Return HTML as-is
        }
      }
      // Fallback to text/plain
      const textPart = message.payload.parts.find(
        (part) => part.mimeType === "text/plain"
      );
      if (textPart) {
        const textContent = getBodyFromPart(textPart);
        if (textContent) return textContent.replace(/\n/g, "<br/>");
      }
    } else {
      const content = getBodyFromPart(message.payload);
      if (content) return content;
    }

    return message.snippet || "No content available";
  };

  // Add this function inside your EmailViewer component
  const getAttachments = () => {
    if (!message.payload?.parts) return [];
    // Recursively collect attachments from all parts
    const collectAttachments = (parts: any[]): any[] =>
      parts.flatMap((part) => {
        if (part.parts) return collectAttachments(part.parts);
        if (
          part.filename &&
          part.filename.length > 0 &&
          part.body?.attachmentId
        ) {
          return [part];
        }
        return [];
      });
    return collectAttachments(message.payload.parts);
  };

  // Add this function to fetch the attachment data as a Blob URL
  const fetchAttachmentUrl = async (attachmentId: string, mimeType: string) => {
    const res = await window.gapi.client.gmail.users.messages.attachments.get({
      userId: "me",
      messageId: message.id,
      id: attachmentId,
    });
    // Decode base64url to binary
    const byteString = atob(
      res.result.data.replace(/-/g, "+").replace(/_/g, "/")
    );
    const byteArray = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      byteArray[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([byteArray], { type: mimeType });
    return URL.createObjectURL(blob);
  };

  const getLabels = (): string[] => {
    return (
      message.labelIds?.filter(
        (label) =>
          !["INBOX", "UNREAD", "IMPORTANT", "CATEGORY_PERSONAL"].includes(label)
      ) || []
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center space-x-3 p-6 border-b border-gray-200">
        <button
          onClick={onBack}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
          <Mail className="w-4 h-4 text-blue-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Email Details</h2>
          <p className="text-sm text-gray-500">View message content</p>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-6">
          {/* Email Header */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {getMessageSubject()}
              </h3>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {getMessageSender()}
                </p>
                <div className="flex items-center space-x-1 text-xs text-gray-500 mt-1">
                  <Clock className="w-3 h-3" />
                  <span>{getMessageDate()}</span>
                </div>
              </div>
            </div>

            {getLabels().length > 0 && (
              <div className="flex items-center space-x-2">
                <Tag className="w-4 h-4 text-gray-400" />
                <div className="flex flex-wrap gap-1">
                  {getLabels().map((label) => (
                    <span
                      key={label}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Email Body */}
          <div className="prose max-w-none">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div
                className="font-sans text-gray-800 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: getMessageBody() }}
              />
            </div>
          </div>
          {/* Attachments Section */}
          {getAttachments().length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold text-gray-700 mb-2">Attachments</h4>
              <ul className="space-y-2">
                {getAttachments().map((att, idx) => (
                  <li key={att.body.attachmentId + idx}>
                    <button
                      className="text-blue-600 underline hover:text-blue-800 text-sm"
                      onClick={async () => {
                        const url = await fetchAttachmentUrl(
                          att.body.attachmentId,
                          att.mimeType
                        );
                        // Open in new tab or trigger download
                        const link = document.createElement("a");
                        link.href = url;
                        link.download = att.filename;
                        link.target = "_blank";
                        link.click();
                        setTimeout(() => URL.revokeObjectURL(url), 10000);
                      }}
                    >
                      {att.filename}
                    </button>
                    <span className="ml-2 text-xs text-gray-400">
                      {att.mimeType}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
