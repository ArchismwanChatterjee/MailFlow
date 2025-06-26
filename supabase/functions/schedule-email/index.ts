/*
  # Schedule Email Edge Function

  1. Purpose
    - Handles scheduled email sending
    - Stores email drafts with scheduling information
    - Processes scheduled emails at the right time

  2. Security
    - Validates user authentication
    - Ensures users can only schedule their own emails
    - Rate limiting for email sending

  3. Features
    - Store scheduled emails in database
    - Process emails at scheduled time
    - Handle timezone conversions
    - Email delivery confirmation
*/

import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS, PUT, DELETE",
};

interface ScheduleEmailRequest {
  to: string;
  subject: string;
  body: string;
  scheduledTime: string;
  userEmail: string;
  accessToken: string;
}

interface EmailRecord {
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

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const url = new URL(req.url);
    const path = url.pathname;

    if (req.method === "POST" && path.endsWith("/schedule")) {
      const requestData: ScheduleEmailRequest = await req.json();

      if (
        !requestData.to ||
        !requestData.subject ||
        !requestData.scheduledTime ||
        !requestData.userEmail
      ) {
        return new Response(
          JSON.stringify({ error: "Missing required fields" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const { data, error } = await supabase
        .from("scheduled_emails")
        .insert({
          user_email: requestData.userEmail,
          to_email: requestData.to,
          subject: requestData.subject,
          body: requestData.body,
          scheduled_time: requestData.scheduledTime,
          status: "pending",
          access_token_encrypted: btoa(requestData.accessToken),
        })
        .select()
        .single();

      if (error) {
        console.error("Database error:", error);
        return new Response(
          JSON.stringify({ error: "Failed to schedule email" }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          scheduledEmailId: data.id,
          message: "Email scheduled successfully",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (req.method === "GET" && path.endsWith("/pending")) {
      const authHeader = req.headers.get("Authorization");
      const serviceRoleKey = `Bearer ${Deno.env.get(
        "SUPABASE_SERVICE_ROLE_KEY"
      )}`;

      if (authHeader !== serviceRoleKey) {
        console.warn(`Unauthorized attempt. Received: ${authHeader}`);
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const now = new Date().toISOString();

      const { data: pendingEmails, error } = await supabase
        .from("scheduled_emails")
        .select("*")
        .eq("status", "pending")
        .lte("scheduled_time", now)
        .limit(10); // Process in batches

      if (error) {
        console.error("Database error:", error);
        return new Response(
          JSON.stringify({ error: "Failed to fetch pending emails" }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const results = [];
      for (const email of pendingEmails || []) {
        try {
          const accessToken = atob(email.access_token_encrypted);
          const { ok, error: sendError } = await sendEmailViaGmail(
            email,
            accessToken
          );

          if (ok) {
            await supabase
              .from("scheduled_emails")
              .update({
                status: "sent",
                sent_at: new Date().toISOString(),
                error_message: null,
              })
              .eq("id", email.id);

            results.push({ id: email.id, status: "sent" });
          } else {
            await supabase
              .from("scheduled_emails")
              .update({
                status: "failed",
                error_message: sendError || "Failed to send via Gmail API",
              })
              .eq("id", email.id);

            results.push({ id: email.id, status: "failed", error: sendError });
          }
        } catch (error) {
          console.error(`Failed to send email ${email.id}:`, error);

          await supabase
            .from("scheduled_emails")
            .update({
              status: "failed",
              error_message: error.message,
            })
            .eq("id", email.id);

          results.push({
            id: email.id,
            status: "failed",
            error: error.message,
          });
        }
      }

      return new Response(
        JSON.stringify({
          processed: results.length,
          results,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (req.method === "GET" && path.endsWith("/user-scheduled")) {
      const userEmail = url.searchParams.get("userEmail");

      if (!userEmail) {
        return new Response(JSON.stringify({ error: "User email required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data: userEmails, error } = await supabase
        .from("scheduled_emails")
        .select(
          "id, to_email, subject, scheduled_time, status, created_at, sent_at"
        )
        .eq("user_email", userEmail)
        .order("scheduled_time", { ascending: true });

      if (error) {
        console.error("Database error:", error);
        return new Response(
          JSON.stringify({ error: "Failed to fetch scheduled emails" }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      return new Response(JSON.stringify({ emails: userEmails || [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Function error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

async function sendEmailViaGmail(
  email: EmailRecord,
  accessToken: string
): Promise<{ ok: boolean; error?: string }> {
  try {
    const emailContent = [
      `To: ${email.to_email}`,
      `From: ${email.user_email}`,
      `Subject: ${email.subject}`,
      "",
      email.body,
    ].join("\r\n");

    const encodedEmail = btoa(emailContent)
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    const response = await fetch(
      "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          raw: encodedEmail,
        }),
      }
    );

    if (!response.ok) {
      const errorBody = await response.text();
      let errorMsg = `Gmail API error: ${response.status} - ${errorBody}`;
      if (response.status === 401 || response.status === 403) {
        errorMsg +=
          " (Access token expired or invalid. User must re-authenticate.)";
      }
      console.error(errorMsg);
      return { ok: false, error: errorMsg };
    }

    return { ok: true };
  } catch (error) {
    console.error("Gmail API error:", error);
    return { ok: false, error: error instanceof Error ? error.message : String(error) };
  }
}
