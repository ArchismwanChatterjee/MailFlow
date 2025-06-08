import React, { useState, useEffect } from 'react';
import { Mail, Clock, User, Loader2, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { GmailMessage, PaginationInfo } from '../types/gmail';
import { useGmailApi } from '../hooks/useGmailApi';
import { EmailViewer } from './EmailViewer';

export const InboxFeed: React.FC = () => {
  const [messages, setMessages] = useState<GmailMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<GmailMessage | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [messagesPerPage] = useState(10);
  const { getInboxMessages, getMessage, isLoading, error } = useGmailApi();

  const loadMessages = async (pageToken?: string, resetMessages = false) => {
    const result = await getInboxMessages(messagesPerPage, pageToken);
    if (result) {
      if (resetMessages) {
        setMessages(result.messages);
        setCurrentPage(1);
      } else {
        setMessages(result.messages);
      }
      setPagination(result.pagination);
    }
  };

  const loadNextPage = async () => {
    if (pagination.nextPageToken) {
      await loadMessages(pagination.nextPageToken);
      setCurrentPage(prev => prev + 1);
    }
  };

  const loadPreviousPage = async () => {
    // For previous page, we need to reload from the beginning
    // This is a limitation of Gmail API - it doesn't provide previous page tokens
    if (currentPage > 1) {
      await loadMessages(undefined, true);
    }
  };

  const handleMessageClick = async (message: GmailMessage) => {
    // Get full message details
    const fullMessage = await getMessage(message.id);
    if (fullMessage) {
      setSelectedMessage(fullMessage);
    }
  };

  const handleBackToInbox = () => {
    setSelectedMessage(null);
  };

  useEffect(() => {
    loadMessages(undefined, true);
  }, []);

  const getMessageSubject = (message: GmailMessage): string => {
    const subjectHeader = message.payload?.headers?.find(h => h.name.toLowerCase() === 'subject');
    return subjectHeader?.value || 'No Subject';
  };

  const getMessageSender = (message: GmailMessage): string => {
    const fromHeader = message.payload?.headers?.find(h => h.name.toLowerCase() === 'from');
    if (fromHeader?.value) {
      const match = fromHeader.value.match(/<(.+)>/) || fromHeader.value.match(/(\S+@\S+)/);
      return match ? match[1] || match[0] : fromHeader.value;
    }
    return 'Unknown Sender';
  };

  const formatDate = (timestamp: string): string => {
    const date = new Date(parseInt(timestamp));
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = diff / (1000 * 60 * 60);

    if (hours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (hours < 168) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  // If a message is selected, show the email viewer
  if (selectedMessage) {
    return <EmailViewer message={selectedMessage} onBack={handleBackToInbox} />;
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load inbox</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => loadMessages(undefined, true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <Mail className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Inbox</h2>
            <p className="text-sm text-gray-500">
              {messages.length} messages (Page {currentPage})
            </p>
          </div>
        </div>
        <button
          onClick={() => loadMessages(undefined, true)}
          disabled={isLoading}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          title="Refresh inbox"
        >
          <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="divide-y divide-gray-100">
        {isLoading && messages.length === 0 ? (
          <div className="p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
            <p className="text-gray-600">Loading your inbox...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No messages found</h3>
            <p className="text-gray-600">Your inbox appears to be empty</p>
          </div>
        ) : (
          messages.map((message) => (
            <div 
              key={message.id} 
              className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => handleMessageClick(message)}
            >
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {getMessageSender(message)}
                    </h3>
                    <div className="flex items-center space-x-1 text-xs text-gray-500 flex-shrink-0">
                      <Clock className="w-3 h-3" />
                      <span>{message.internalDate ? formatDate(message.internalDate) : 'Recent'}</span>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-gray-800 mb-1 truncate">
                    {getMessageSubject(message)}
                  </p>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {message.snippet || 'No preview available'}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination Controls */}
      {messages.length > 0 && (
        <div className="flex items-center justify-between p-4 border-t border-gray-200">
          <button
            onClick={loadPreviousPage}
            disabled={currentPage === 1 || isLoading}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Page {currentPage}</span>
            {pagination.resultSizeEstimate && (
              <span className="text-xs text-gray-500">
                (~{pagination.resultSizeEstimate} total)
              </span>
            )}
          </div>

          <button
            onClick={loadNextPage}
            disabled={!pagination.nextPageToken || isLoading}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};