-- B & A Institute: online admissions.
-- Run once in the Supabase dashboard: SQL Editor -> New query -> paste -> Run.
-- Safe to run again (every statement is idempotent).
--
-- All names are prefixed "ba_" / "ba-" because this Supabase project is shared
-- with other apps. Nothing here touches their tables or buckets.
--
-- Access model: the website and the admin dashboard use the server-side secret
-- key only. RLS is on with NO policies, so the public (anon / authenticated)
-- API keys cannot read or write anything here.

create table if not exists public.ba_applications (
  id              uuid primary key default gen_random_uuid(),
  reference       text not null unique,
  status          text not null default 'new'
                    check (status in ('new', 'in_review', 'accepted', 'waitlisted', 'declined')),
  locale          text,

  -- Learner
  first_name      text not null,
  last_name       text not null,
  dob             date not null,
  gender          text not null,
  nationality     text,
  current_school  text,
  current_class   text,

  -- Programme
  section         text not null check (section in ('anglophone', 'francophone')),
  level           text not null,
  pathway         text,
  term            text not null,

  -- Parent / guardian
  guardian_name   text not null,
  relationship    text not null,
  phone           text not null,
  whatsapp        text,
  email           text not null,
  address         text not null,
  notes           text,

  -- Storage paths inside the ba-applications bucket, keyed by document type.
  documents       jsonb not null default '{}'::jsonb,

  -- Staff only
  internal_notes  text,

  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists ba_applications_created_at_idx on public.ba_applications (created_at desc);
create index if not exists ba_applications_status_idx     on public.ba_applications (status);

create or replace function public.ba_set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists ba_applications_updated_at on public.ba_applications;
create trigger ba_applications_updated_at
  before update on public.ba_applications
  for each row execute function public.ba_set_updated_at();

alter table public.ba_applications enable row level security;
revoke all on public.ba_applications from anon, authenticated;

-- Private bucket for the uploaded documents (birth certificate, report card, photo).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'ba-applications',
  'ba-applications',
  false,
  3145728,
  array['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
  set public = false,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;
