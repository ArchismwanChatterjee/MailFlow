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
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { getInboxMessages, getMessage, isLoading, error } = useGmailApi();

  const loadMessages = async (pageToken?: string, resetMessages = false) => {
    setIsTransitioning(true);
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
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const loadNextPage = async () => {
    if (pagination.nextPageToken) {
      await loadMessages(pagination.nextPageToken);
      setCurrentPage(prev => prev + 1);
    }
  };

  const loadPreviousPage = async () => {
    if (currentPage > 1) {
      await loadMessages(undefined, true);
    }
  };

  const handleMessageClick = async (message: GmailMessage) => {
    setIsTransitioning(true);
    const fullMessage = await getMessage(message.id);
    if (fullMessage) {
      setTimeout(() => {
        setSelectedMessage(fullMessage);
        setIsTransitioning(false);
      }, 150);
    } else {
      setIsTransitioning(false);
    }
  };

  const handleBackToInbox = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedMessage(null);
      setIsTransitioning(false);
    }, 150);
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
    return (
      <div className={`transition-all duration-300 ${isTransitioning ? 'opacity-0 blur-sm scale-95' : 'opacity-100 blur-0 scale-100'}`}>
        <EmailViewer message={selectedMessage} onBack={handleBackToInbox} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:p-8">
        <div className="text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load inbox</h3>
          <p className="text-gray-600 mb-4 text-sm lg:text-base">{error}</p>
          <button
            onClick={() => loadMessages(undefined, true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors text-sm lg:text-base"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 transition-all duration-300 ${isTransitioning ? 'opacity-50 blur-sm' : 'opacity-100 blur-0'}`}>
      <div className="flex items-center justify-between p-4 lg:p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3 min-w-0 flex-1">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Mail className="w-4 h-4 text-blue-600" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-semibold text-gray-900">Inbox</h2>
            <p className="text-sm text-gray-500 truncate">
              <span className="inline lg:hidden">{messages.length} msgs</span>
              <span className="hidden lg:inline">{messages.length} messages</span>
              <span className="hidden sm:inline"> (Page {currentPage})</span>
            </p>
          </div>
        </div>
        <button
          onClick={() => loadMessages(undefined, true)}
          disabled={isLoading}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 flex-shrink-0"
          title="Refresh inbox"
        >
          <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="divide-y divide-gray-100">
        {isLoading && messages.length === 0 ? (
          <div className="p-6 lg:p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
            <p className="text-gray-600 text-sm lg:text-base">Loading your inbox...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="p-6 lg:p-8 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No messages found</h3>
            <p className="text-gray-600 text-sm lg:text-base">Your inbox appears to be empty</p>
          </div>
        ) : (
          messages.map((message) => (
            <div 
              key={message.id} 
              className="p-3 lg:p-4 hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => handleMessageClick(message)}
            >
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-teal-400 to-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1 gap-2">
                    <h3 className="text-sm font-medium text-gray-900 truncate flex-1">
                      {getMessageSender(message)}
                    </h3>
                    <div className="flex items-center space-x-1 text-xs text-gray-500 flex-shrink-0">
                      <Clock className="w-3 h-3" />
                      <span className="hidden sm:inline">
                        {message.internalDate ? formatDate(message.internalDate) : 'Recent'}
                      </span>
                      <span className="sm:hidden">
                        {message.internalDate ? formatDate(message.internalDate).split(' ')[0] : 'Now'}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-gray-800 mb-1 truncate">
                    {getMessageSubject(message)}
                  </p>
                  <p className="text-xs lg:text-sm text-gray-600 line-clamp-2">
                    {message.snippet || 'No preview available'}
                  </p>
                  
                  {/* Mobile: Show message ID */}
                  <div className="mt-2 lg:hidden">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                      ID: {message.id.substring(0, 8)}...
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination Controls */}
      {messages.length > 0 && (
        <div className="flex items-center justify-between p-3 lg:p-4 border-t border-gray-200 gap-2">
          <button
            onClick={loadPreviousPage}
            disabled={currentPage === 1 || isLoading}
            className="flex items-center space-x-1 lg:space-x-2 px-3 lg:px-4 py-2 text-xs lg:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-3 h-3 lg:w-4 lg:h-4" />
            <span className="hidden sm:inline">Previous</span>
            <span className="sm:hidden">Prev</span>
          </button>

          <div className="flex items-center space-x-1 lg:space-x-2 text-center">
            <span className="text-xs lg:text-sm text-gray-600">
              <span className="hidden sm:inline">Page </span>{currentPage}
            </span>
            {pagination.resultSizeEstimate && (
              <span className="text-xs text-gray-500 hidden lg:inline">
                (~{pagination.resultSizeEstimate} total)
              </span>
            )}
          </div>

          <button
            onClick={loadNextPage}
            disabled={!pagination.nextPageToken || isLoading}
            className="flex items-center space-x-1 lg:space-x-2 px-3 lg:px-4 py-2 text-xs lg:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span className="hidden sm:inline">Next</span>
            <span className="sm:hidden">Next</span>
            <ChevronRight className="w-3 h-3 lg:w-4 lg:h-4" />
          </button>
        </div>
      )}
    </div>
  );
};