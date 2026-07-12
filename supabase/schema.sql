-- Huntly waitlist table
create table if not exists waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  role text not null check (role in ('recruiter', 'candidate')),
  name text,
  created_at timestamptz not null default now()
);

create unique index if not exists waitlist_email_idx on waitlist (lower(email));

alter table waitlist enable row level security;

-- Only the service role (used server-side in /api/waitlist) can read/write.
-- No public policies are defined, so anon/authenticated clients have no access.
