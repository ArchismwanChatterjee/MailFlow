export interface GmailMessage {
  id: string;
  threadId: string;
  snippet: string;
  payload?: {
    headers: Array<{
      name: string;
      value: string;
    }>;
    body?: {
      data?: string;
    };
    parts?: Array<{
      mimeType: string;
      body?: {
        data?: string;
      };
    }>;
  };
  internalDate?: string;
  labelIds?: string[];
}

export interface GmailLabel {
  id: string;
  name: string;
  messageListVisibility?: string;
  labelListVisibility?: string;
}

export interface UserProfile {
  emailAddress: string;
  messagesTotal?: number;
  threadsTotal?: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  userProfile: UserProfile | null;
}

export interface EmailDraft {
  to: string;
  subject: string;
  body: string;
}

export interface PaginationInfo {
  nextPageToken?: string;
  resultSizeEstimate?: number;
}