-- Run this in Supabase SQL Editor AFTER cf_schema.sql
-- Creates the cf_investments table for personal short-term investment tracking

CREATE TABLE IF NOT EXISTS cf_investments (
  id              uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  entity          text        NOT NULL,
  brief           text        NOT NULL DEFAULT '',
  sector          text        NOT NULL DEFAULT 'Other',
  amount_invested numeric(15,2) NOT NULL,
  expected_return numeric(15,2),
  target_date     date,
  status          text        NOT NULL DEFAULT 'active'
                  CHECK (status IN ('active','gained','lost','partial')),
  actual_return   numeric(15,2),
  notes           text        NOT NULL DEFAULT '',
  invested_at     date        NOT NULL DEFAULT CURRENT_DATE,
  created_at      timestamptz DEFAULT now()
);

ALTER TABLE cf_investments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_own_investments"
  ON cf_investments FOR ALL
  USING  (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
