-- DAHABI Academy registration intake
-- Additive migration from the legacy Firebase `registrations` collection.
-- Receipt images remain optional compatibility data until a dedicated private
-- Storage bucket and upload flow are enabled.

create sequence if not exists public.registration_student_id_seq
  start with 10001
  increment by 1;

create table if not exists public.registration_submissions (
  id uuid primary key default gen_random_uuid(),
  student_id text not null,
  first_name text not null,
  middle_name text not null,
  last_name text not null,
  age smallint not null check (age between 8 and 80),
  gender text not null check (gender in ('Male', 'Female')),
  email text not null,
  country_code text not null,
  phone text not null,
  full_address text not null,
  course text not null,
  course_title_full text not null,
  course_price text not null,
  referral_source text not null,
  has_laptop text not null check (has_laptop in ('Haa', 'Maya')),
  time_commitment text not null check (time_commitment in ('Haa', 'Maya')),
  fee_agreement text not null,
  message text,
  receipt_image_data_url text,
  review_status text not null default 'pending'
    check (review_status in ('pending', 'contacted', 'approved', 'rejected')),
  admin_notes text,
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users(id) on delete set null,
  submitted_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint registration_submissions_student_id_format
    check (student_id ~ '^DA-[0-9]{5,}$'),
  constraint registration_submissions_message_length
    check (message is null or char_length(message) <= 500),
  constraint registration_submissions_receipt_size
    check (receipt_image_data_url is null or octet_length(receipt_image_data_url) <= 850000)
);

create unique index if not exists registration_submissions_student_id_uidx
  on public.registration_submissions(student_id);

create unique index if not exists registration_submissions_email_lower_uidx
  on public.registration_submissions(lower(email));

create or replace function public.registration_submissions_set_defaults()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  -- The browser may submit only intake fields. Server-side defaults own IDs,
  -- timestamps, and moderation fields.
  new.student_id := 'DA-' || lpad(nextval('public.registration_student_id_seq')::text, 5, '0');
  new.review_status := 'pending';
  new.admin_notes := null;
  new.reviewed_at := null;
  new.reviewed_by := null;
  new.submitted_at := now();
  new.created_at := now();
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists registration_submissions_set_defaults on public.registration_submissions;
create trigger registration_submissions_set_defaults
before insert on public.registration_submissions
for each row execute function public.registration_submissions_set_defaults();

create or replace function public.registration_submissions_set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists registration_submissions_set_updated_at on public.registration_submissions;
create trigger registration_submissions_set_updated_at
before update on public.registration_submissions
for each row execute function public.registration_submissions_set_updated_at();

alter table public.registration_submissions enable row level security;

grant insert on public.registration_submissions to anon, authenticated;
grant select, update, delete on public.registration_submissions to authenticated;

drop policy if exists registration_submissions_public_insert on public.registration_submissions;
create policy registration_submissions_public_insert
on public.registration_submissions
for insert
to anon, authenticated
with check (
  review_status = 'pending'
  and admin_notes is null
  and reviewed_at is null
  and reviewed_by is null
);

drop policy if exists registration_submissions_admin_manage on public.registration_submissions;
create policy registration_submissions_admin_manage
on public.registration_submissions
for all
to authenticated
using (is_admin())
with check (is_admin());

comment on table public.registration_submissions is
  'Public DAHABI Academy registration intake migrated from the legacy Firebase registrations collection.';
comment on column public.registration_submissions.receipt_image_data_url is
  'Temporary compatibility field for the legacy 600KB client-side receipt preview; migrate to private Storage before production scale.';
