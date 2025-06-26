CREATE TABLE IF NOT EXISTS scheduled_emails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email text NOT NULL,
  to_email text NOT NULL,
  subject text NOT NULL DEFAULT '',
  body text NOT NULL DEFAULT '',
  scheduled_time timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  access_token_encrypted text NOT NULL,
  created_at timestamptz DEFAULT now(),
  sent_at timestamptz,
  error_message text
);

ALTER TABLE scheduled_emails ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own scheduled emails"
  ON scheduled_emails
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'email' = user_email)
  WITH CHECK (auth.jwt() ->> 'email' = user_email);

CREATE POLICY "Service role can process all emails"
  ON scheduled_emails
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_scheduled_emails_user_email 
  ON scheduled_emails(user_email);

CREATE INDEX IF NOT EXISTS idx_scheduled_emails_processing 
  ON scheduled_emails(status, scheduled_time) 
  WHERE status = 'pending';

CREATE INDEX IF NOT EXISTS idx_scheduled_emails_status 
  ON scheduled_emails(status);

CREATE INDEX IF NOT EXISTS idx_scheduled_emails_created_at 
  ON scheduled_emails(created_at);