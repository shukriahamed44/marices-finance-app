-- Run this in Supabase SQL Editor to enable the investor recycle bin (trash) feature.
alter table investors add column if not exists deleted_at timestamptz;
