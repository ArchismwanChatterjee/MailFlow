import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface ScheduledEmail {
  id: string;
  user_email: string;
  to_email: string;
  subject: string;
  body: string;
  scheduled_time: string;
  status: "pending" | "sent" | "failed";
  created_at: string;
  sent_at?: string;
  error_message?: string;
}

export class EmailSchedulingService {
  static async scheduleEmail(
    to: string,
    subject: string,
    body: string,
    scheduledTime: Date,
    userEmail: string,
    accessToken: string
  ): Promise<{ success: boolean; scheduledEmailId?: string; error?: string }> {
    try {
      const response = await fetch(
        `${supabaseUrl}/functions/v1/schedule-email/schedule`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${supabaseAnonKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to,
            subject,
            body,
            scheduledTime: scheduledTime.toISOString(),
            userEmail,
            accessToken,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: result.error || "Failed to schedule email",
        };
      }

      return {
        success: true,
        scheduledEmailId: result.scheduledEmailId,
      };
    } catch (error) {
      console.error("Error scheduling email:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  static async getUserScheduledEmails(
    userEmail: string
  ): Promise<ScheduledEmail[]> {
    try {
      const response = await fetch(
        `${supabaseUrl}/functions/v1/schedule-email/user-scheduled?userEmail=${encodeURIComponent(
          userEmail
        )}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${supabaseAnonKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        console.error("Failed to fetch scheduled emails:", result.error);
        return [];
      }

      return result.emails || [];
    } catch (error) {
      console.error("Error fetching scheduled emails:", error);
      return [];
    }
  }

  static async cancelScheduledEmail(emailId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("scheduled_emails")
        .update({ status: "cancelled" })
        .eq("id", emailId)
        .eq("status", "pending");

      return !error;
    } catch (error) {
      console.error("Error cancelling scheduled email:", error);
      return false;
    }
  }
}
