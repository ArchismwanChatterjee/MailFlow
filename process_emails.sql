SELECT
  net.http_post(
    url := 'https://ibvdymlyonbrxetrnkji.supabase.co/functions/v1/process-scheduled-emails',
    headers := jsonb_build_object(
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlidmR5bWx5b25icnhldHJua2ppIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTU5MjMwMywiZXhwIjoyMDY1MTY4MzAzfQ.4ZjE1EtALkQCA2xkj4xrvdt_BOgxelYdom9fULCBO1M',
      'Content-Type', 'application/json'
    ),
    timeout_milliseconds := 5000
  );


-- Cron Job to run process-scheduled-emails edge function every minute 