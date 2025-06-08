import { useState, useCallback } from 'react';
import { GmailMessage, GmailLabel, EmailDraft, PaginationInfo } from '../types/gmail';

export const useGmailApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApiCall = useCallback(async <T>(apiCall: () => Promise<T>): Promise<T | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await apiCall();
      return result;
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getInboxMessages = useCallback(async (
    maxResults: number = 10, 
    pageToken?: string
  ): Promise<{ messages: GmailMessage[]; pagination: PaginationInfo } | null> => {
    return handleApiCall(async () => {
      const requestParams: any = {
        userId: 'me',
        labelIds: 'INBOX',
        maxResults,
      };

      if (pageToken) {
        requestParams.pageToken = pageToken;
      }

      const response = await window.gapi.client.gmail.users.messages.list(requestParams);

      const messages = response.result.messages || [];
      const detailedMessages: GmailMessage[] = [];

      for (const message of messages) {
        const details = await window.gapi.client.gmail.users.messages.get({
          userId: 'me',
          id: message.id,
        });
        detailedMessages.push(details.result);
      }

      return {
        messages: detailedMessages,
        pagination: {
          nextPageToken: response.result.nextPageToken,
          resultSizeEstimate: response.result.resultSizeEstimate,
        },
      };
    });
  }, [handleApiCall]);

  const getMessage = useCallback(async (messageId: string): Promise<GmailMessage | null> => {
    return handleApiCall(async () => {
      const response = await window.gapi.client.gmail.users.messages.get({
        userId: 'me',
        id: messageId,
        format: 'full',
      });
      return response.result;
    });
  }, [handleApiCall]);

  const getLabels = useCallback(async (): Promise<GmailLabel[] | null> => {
    return handleApiCall(async () => {
      const response = await window.gapi.client.gmail.users.labels.list({
        userId: 'me',
      });
      return response.result.labels || [];
    });
  }, [handleApiCall]);

  const createDraft = useCallback(async (draft: EmailDraft): Promise<any> => {
    return handleApiCall(async () => {
      const userProfile = await window.gapi.client.gmail.users.getProfile({
        userId: 'me',
      });
      
      const email = [
        `To: ${draft.to}`,
        `From: ${userProfile.result.emailAddress}`,
        `Subject: ${draft.subject}`,
        '',
        draft.body,
      ].join('\r\n');

      const encodedEmail = btoa(email)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      const response = await window.gapi.client.gmail.users.drafts.create({
        userId: 'me',
        resource: {
          message: {
            raw: encodedEmail,
          },
        },
      });

      return response.result;
    });
  }, [handleApiCall]);

  const sendEmail = useCallback(async (draft: EmailDraft): Promise<any> => {
    return handleApiCall(async () => {
      const userProfile = await window.gapi.client.gmail.users.getProfile({
        userId: 'me',
      });
      
      const email = [
        `To: ${draft.to}`,
        `From: ${userProfile.result.emailAddress}`,
        `Subject: ${draft.subject}`,
        '',
        draft.body,
      ].join('\r\n');

      const encodedEmail = btoa(email)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      const response = await window.gapi.client.gmail.users.messages.send({
        userId: 'me',
        resource: {
          raw: encodedEmail,
        },
      });

      return response.result;
    });
  }, [handleApiCall]);

  return {
    isLoading,
    error,
    getInboxMessages,
    getMessage,
    getLabels,
    createDraft,
    sendEmail,
  };
};