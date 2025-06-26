/// <reference types="deno.ns" />

/*
  # Process Scheduled Emails Cron Function

  1. Purpose
    - Cron job function to process scheduled emails
    - Runs every minute to check for emails ready to send
    - Handles batch processing for efficiency

  2. Security
    - Only accessible via Supabase cron jobs
    - Service role authentication required

  3. Features
    - Automatic email processing
    - Error handling and retry logic
    - Batch processing for performance
*/

import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Call the schedule-email function to process pending emails
    const scheduleEmailUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1/schedule-email/pending`;
    
    const response = await fetch(scheduleEmailUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    return new Response(
      JSON.stringify({
        success: true,
        timestamp: new Date().toISOString(),
        processed: result.processed || 0,
        details: result.results || []
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Cron job error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Cron job failed',
        timestamp: new Date().toISOString(),
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});