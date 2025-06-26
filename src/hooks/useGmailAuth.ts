import { useState, useEffect, useCallback } from "react";
import { AuthState, UserProfile } from "../types/gmail";

const CLIENT_ID = import.meta.env.VITE_APP_GMAIL_CLIENT_ID as string;
const API_KEY = import.meta.env.VITE_APP_GMAIL_API_KEY as string;
const DISCOVERY_DOC = import.meta.env.VITE_APP_GMAIL_DISCOVERY_DOC as string;
const SCOPES = import.meta.env.VITE_APP_GMAIL_SCOPES as string;

declare global {
  interface Window {
    gapi: any;
    google: any;
  }
}

export const useGmailAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    error: null,
    userProfile: null,
  });

  const [tokenClient, setTokenClient] = useState<any>(null);
  const [gapiInited, setGapiInited] = useState(false);
  const [gisInited, setGisInited] = useState(false);

  const initializeGapi = useCallback(async () => {
    try {
      await window.gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: [DISCOVERY_DOC],
      });
      setGapiInited(true);
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        error: "Failed to initialize Google API",
        isLoading: false,
      }));
    }
  }, []);

  const initializeGis = useCallback(() => {
    try {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: async (response: any) => {
          if (response.error) {
            setAuthState((prev) => ({
              ...prev,
              error: response.error,
              isLoading: false,
            }));
            return;
          }

          try {
            const profile = await getUserProfile();
            setAuthState({
              isAuthenticated: true,
              isLoading: false,
              error: null,
              userProfile: profile,
            });
          } catch (error) {
            setAuthState((prev) => ({
              ...prev,
              error: "Failed to get user profile",
              isLoading: false,
            }));
          }
        },
      });
      setTokenClient(client);
      setGisInited(true);
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        error: "Failed to initialize Google Identity Services",
        isLoading: false,
      }));
    }
  }, []);

  const getUserProfile = async (): Promise<UserProfile> => {
    const response = await window.gapi.client.gmail.users.getProfile({
      userId: "me",
    });
    return response.result;
  };

  const signIn = useCallback(() => {
    if (!tokenClient) return;

    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

    if (window.gapi.client.getToken() === null) {
      tokenClient.requestAccessToken({ prompt: "consent" });
    } else {
      tokenClient.requestAccessToken({ prompt: "" });
    }
  }, [tokenClient]);

  const signOut = useCallback(() => {
    const token = window.gapi.client.getToken();
    if (token !== null) {
      window.google.accounts.oauth2.revoke(token.access_token);
      window.gapi.client.setToken("");
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        error: null,
        userProfile: null,
      });
    }
  }, []);

  useEffect(() => {
    const checkInitialization = () => {
      if (gapiInited && gisInited) {
        setAuthState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    if (window.gapi && window.gapi.load) {
      window.gapi.load("client", initializeGapi);
    }

    if (window.google && window.google.accounts) {
      initializeGis();
    }

    const gapiInterval = setInterval(() => {
      if (window.gapi && window.gapi.load && !gapiInited) {
        window.gapi.load("client", initializeGapi);
      }
      if (window.google && window.google.accounts && !gisInited) {
        initializeGis();
      }
      if (gapiInited && gisInited) {
        clearInterval(gapiInterval);
      }
    }, 100);

    checkInitialization();

    return () => clearInterval(gapiInterval);
  }, [gapiInited, gisInited, initializeGapi, initializeGis]);

  return {
    ...authState,
    signIn,
    signOut,
    isReady: gapiInited && gisInited,
  };
};
