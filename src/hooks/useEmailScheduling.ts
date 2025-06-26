import { useState, useCallback } from "react";
import { EmailSchedulingService, ScheduledEmail } from "../lib/supabase";

export const useEmailScheduling = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scheduledEmails, setScheduledEmails] = useState<ScheduledEmail[]>([]);

  const scheduleEmail = useCallback(
    async (
      to: string,
      subject: string,
      body: string,
      scheduledTime: Date,
      userEmail: string,
      accessToken: string
    ): Promise<boolean> => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await EmailSchedulingService.scheduleEmail(
          to,
          subject,
          body,
          scheduledTime,
          userEmail,
          accessToken
        );

        if (result.success) {
          // Refresh the scheduled emails list
          await loadScheduledEmails(userEmail);
          return true;
        } else {
          setError(result.error || "Failed to schedule email");
          return false;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const loadScheduledEmails = useCallback(async (userEmail: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const emails = await EmailSchedulingService.getUserScheduledEmails(
        userEmail
      );
      setScheduledEmails(emails);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load scheduled emails";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const cancelScheduledEmail = useCallback(
    async (emailId: string, userEmail: string): Promise<boolean> => {
      setIsLoading(true);
      setError(null);

      try {
        const success = await EmailSchedulingService.cancelScheduledEmail(
          emailId
        );

        if (success) {
          // Refresh the scheduled emails list
          await loadScheduledEmails(userEmail);
          return true;
        } else {
          setError("Failed to cancel scheduled email");
          return false;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [loadScheduledEmails]
  );

  return {
    isLoading,
    error,
    scheduledEmails,
    scheduleEmail,
    loadScheduledEmails,
    cancelScheduledEmail,
  };
};
