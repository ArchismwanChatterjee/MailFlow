import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Calendar,
  User,
  Tag,
  Mail,
  Clock,
  Zap,
  RefreshCw,
  X,
} from "lucide-react";
import { useGmailApi } from "../hooks/useGmailApi";
import { GmailMessage } from "../types/gmail";

interface AuthState {
  userEmail: string;
  accessToken: string;
  isAuthenticated: boolean;
}

interface SmartSearchProps {
  authState: AuthState;
}

interface SearchFilters {
  query: string;
  sender: string;
  dateRange: "all" | "1d" | "7d" | "30d" | "90d";
  hasAttachment: boolean;
  isUnread: boolean;
  label: string;
}

interface SearchSuggestion {
  type: "sender" | "subject" | "keyword";
  value: string;
  count: number;
}

export const SmartSearch: React.FC<SmartSearchProps> = ({ authState }) => {
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    query: "",
    sender: "",
    dateRange: "all",
    hasAttachment: false,
    isUnread: false,
    label: "",
  });

  const [searchResults, setSearchResults] = useState<GmailMessage[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const { getInboxMessages } = useGmailApi();

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("mailflow-recent-searches");
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse recent searches:", e);
      }
    }
  }, []);

  // Save recent searches
  const saveRecentSearch = (query: string) => {
    if (!query.trim()) return;

    const updated = [query, ...recentSearches.filter((s) => s !== query)].slice(
      0,
      5
    );
    setRecentSearches(updated);
    localStorage.setItem("mailflow-recent-searches", JSON.stringify(updated));
  };

  // Generate smart suggestions based on recent emails
  const generateSuggestions = async () => {
    if (!authState.isAuthenticated) return;

    try {
      const result = await getInboxMessages(100);
      if (result && result.messages) {
        const senderCounts: { [key: string]: number } = {};
        const subjectWords: { [key: string]: number } = {};

        result.messages.forEach((msg) => {
          // Extract senders
          const fromHeader = msg.payload?.headers?.find(
            (h) => h.name.toLowerCase() === "from"
          );
          if (fromHeader) {
            const email = extractEmail(fromHeader.value);
            senderCounts[email] = (senderCounts[email] || 0) + 1;
          }

          // Extract subject keywords
          const subjectHeader = msg.payload?.headers?.find(
            (h) => h.name.toLowerCase() === "subject"
          );
          if (subjectHeader) {
            const words = subjectHeader.value
              .toLowerCase()
              .split(/\s+/)
              .filter(
                (word) =>
                  word.length > 3 &&
                  ![
                    "the",
                    "and",
                    "for",
                    "are",
                    "but",
                    "not",
                    "you",
                    "all",
                    "can",
                    "had",
                    "her",
                    "was",
                    "one",
                    "our",
                    "out",
                    "day",
                    "get",
                    "has",
                    "him",
                    "his",
                    "how",
                    "its",
                    "may",
                    "new",
                    "now",
                    "old",
                    "see",
                    "two",
                    "who",
                    "boy",
                    "did",
                    "she",
                    "use",
                    "way",
                    "who",
                    "oil",
                    "sit",
                    "set",
                  ].includes(word)
              );

            words.forEach((word) => {
              subjectWords[word] = (subjectWords[word] || 0) + 1;
            });
          }
        });

        const topSenders = Object.entries(senderCounts)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5)
          .map(([email, count]) => ({
            type: "sender" as const,
            value: email,
            count,
          }));

        const topKeywords = Object.entries(subjectWords)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5)
          .map(([word, count]) => ({
            type: "keyword" as const,
            value: word,
            count,
          }));

        setSuggestions([...topSenders, ...topKeywords]);
      }
    } catch (error) {
      console.error("Failed to generate suggestions:", error);
    }
  };

  const extractEmail = (fromValue: string): string => {
    const match = fromValue.match(/<(.+)>/) || fromValue.match(/(\S+@\S+)/);
    return match ? match[1] || match[0] : fromValue;
  };

  const performSearch = async () => {
    if (!authState.isAuthenticated) return;

    setIsSearching(true);
    try {
      // Build Gmail search query
      let gmailQuery = "";

      if (searchFilters.query) {
        gmailQuery += searchFilters.query;
      }

      if (searchFilters.sender) {
        gmailQuery += ` from:${searchFilters.sender}`;
      }

      if (searchFilters.dateRange !== "all") {
        const days =
          searchFilters.dateRange === "1d"
            ? 1
            : searchFilters.dateRange === "7d"
            ? 7
            : searchFilters.dateRange === "30d"
            ? 30
            : 90;
        gmailQuery += ` newer_than:${days}d`;
      }

      if (searchFilters.hasAttachment) {
        gmailQuery += " has:attachment";
      }

      if (searchFilters.isUnread) {
        gmailQuery += " is:unread";
      }

      if (searchFilters.label) {
        gmailQuery += ` label:${searchFilters.label}`;
      }

      // Use Gmail API search
      const response = await window.gapi.client.gmail.users.messages.list({
        userId: "me",
        q: gmailQuery.trim(),
        maxResults: 20,
      });

      if (response.result.messages) {
        const detailedMessages: GmailMessage[] = [];

        for (const message of response.result.messages) {
          const details = await window.gapi.client.gmail.users.messages.get({
            userId: "me",
            id: message.id,
          });
          detailedMessages.push(details.result);
        }

        setSearchResults(detailedMessages);

        // Save search query
        if (searchFilters.query) {
          saveRecentSearch(searchFilters.query);
        }
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Search failed:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchFilters({
      query: "",
      sender: "",
      dateRange: "all",
      hasAttachment: false,
      isUnread: false,
      label: "",
    });
    setSearchResults([]);
  };

  const applySuggestion = (suggestion: SearchSuggestion) => {
    if (suggestion.type === "sender") {
      setSearchFilters((prev) => ({ ...prev, sender: suggestion.value }));
    } else {
      setSearchFilters((prev) => ({ ...prev, query: suggestion.value }));
    }
  };

  const getMessageSubject = (message: GmailMessage): string => {
    const subjectHeader = message.payload?.headers?.find(
      (h) => h.name.toLowerCase() === "subject"
    );
    return subjectHeader?.value || "No Subject";
  };

  const getMessageSender = (message: GmailMessage): string => {
    const fromHeader = message.payload?.headers?.find(
      (h) => h.name.toLowerCase() === "from"
    );
    return fromHeader?.value || "Unknown Sender";
  };

  const formatDate = (timestamp: string): string => {
    const date = new Date(parseInt(timestamp));
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year:
        date.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
    });
  };

  useEffect(() => {
    if (authState.isAuthenticated) {
      generateSuggestions();
    }
  }, [authState.isAuthenticated]);

  if (!authState.isAuthenticated) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:p-8">
        <div className="text-center">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-6 h-6 text-orange-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Authentication Required
          </h3>
          <p className="text-gray-600">
            Please sign in to use smart search features.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between p-4 lg:p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <Search className="w-4 h-4 text-orange-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Smart Search
              </h2>
              <p className="text-sm text-gray-500">
                Advanced email search with AI-powered suggestions
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-lg transition-colors ${
              showFilters
                ? "bg-orange-100 text-orange-600"
                : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            }`}
            title="Toggle filters"
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4 lg:p-6">
          <div className="flex space-x-3 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchFilters.query}
                onChange={(e) =>
                  setSearchFilters((prev) => ({
                    ...prev,
                    query: e.target.value,
                  }))
                }
                placeholder="Search emails, subjects, content..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                onKeyPress={(e) => e.key === "Enter" && performSearch()}
              />
            </div>
            <button
              onClick={performSearch}
              disabled={isSearching}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white rounded-lg transition-colors flex items-center space-x-2"
            >
              {isSearching ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
              <span className="hidden sm:inline">Search</span>
            </button>
            {(searchFilters.query ||
              searchFilters.sender ||
              searchResults.length > 0) && (
              <button
                onClick={clearSearch}
                className="px-4 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                title="Clear search"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-4">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sender
                  </label>
                  <input
                    type="email"
                    value={searchFilters.sender}
                    onChange={(e) =>
                      setSearchFilters((prev) => ({
                        ...prev,
                        sender: e.target.value,
                      }))
                    }
                    placeholder="sender@example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date Range
                  </label>
                  <select
                    value={searchFilters.dateRange}
                    onChange={(e) =>
                      setSearchFilters((prev) => ({
                        ...prev,
                        dateRange: e.target.value as any,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                  >
                    <option value="all">All time</option>
                    <option value="1d">Last 24 hours</option>
                    <option value="7d">Last 7 days</option>
                    <option value="30d">Last 30 days</option>
                    <option value="90d">Last 90 days</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Options
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={searchFilters.hasAttachment}
                        onChange={(e) =>
                          setSearchFilters((prev) => ({
                            ...prev,
                            hasAttachment: e.target.checked,
                          }))
                        }
                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Has attachment
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={searchFilters.isUnread}
                        onChange={(e) =>
                          setSearchFilters((prev) => ({
                            ...prev,
                            isUnread: e.target.checked,
                          }))
                        }
                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Unread only
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Smart Suggestions & Recent Searches */}
      {!isSearching && searchResults.length === 0 && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Smart Suggestions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Zap className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Smart Suggestions
              </h3>
            </div>
            <div className="space-y-3">
              {suggestions.slice(0, 6).map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => applySuggestion(suggestion)}
                  className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors text-left"
                >
                  <div className="flex items-center space-x-3">
                    {suggestion.type === "sender" ? (
                      <User className="w-4 h-4 text-blue-600" />
                    ) : (
                      <Tag className="w-4 h-4 text-green-600" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {suggestion.value}
                      </p>
                      <p className="text-xs text-gray-500">
                        {suggestion.type === "sender"
                          ? "Frequent sender"
                          : "Common keyword"}{" "}
                        • {suggestion.count} emails
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Searches */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Clock className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Searches
              </h3>
            </div>
            {recentSearches.length > 0 ? (
              <div className="space-y-2">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      setSearchFilters((prev) => ({ ...prev, query: search }))
                    }
                    className="w-full flex items-center space-x-3 p-3 bg-gray-50 hover:bg-purple-50 rounded-lg transition-colors text-left"
                  >
                    <Search className="w-4 h-4 text-purple-600" />
                    <span className="text-sm text-gray-900">{search}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Search className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No recent searches</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Search Results */}
      {isSearching && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:p-8">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-4" />
            <p className="text-gray-600">Searching your emails...</p>
          </div>
        </div>
      )}

      {!isSearching && searchResults.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between p-4 lg:p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-orange-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Search Results
                </h3>
                <p className="text-sm text-gray-500">
                  {searchResults.length} emails found
                </p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {searchResults.map((message) => (
              <div
                key={message.id}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {getMessageSender(message)}
                      </h4>
                      <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                        {message.internalDate
                          ? formatDate(message.internalDate)
                          : "Recent"}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-800 mb-1 truncate">
                      {getMessageSubject(message)}
                    </p>
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {message.snippet || "No preview available"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!isSearching &&
        searchResults.length === 0 &&
        (searchFilters.query || searchFilters.sender) && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:p-8">
            <div className="text-center">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Results Found
              </h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search terms or filters
              </p>
              <button
                onClick={clearSearch}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
              >
                Clear Search
              </button>
            </div>
          </div>
        )}
    </div>
  );
};
