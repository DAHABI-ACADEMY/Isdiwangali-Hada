-- Secure public submission entry point.
-- The browser calls this function instead of selecting from the protected table.

revoke insert on table public.registration_submissions from anon, authenticated;
drop policy if exists registration_submissions_public_insert on public.registration_submissions;

create or replace function public.submit_registration(payload jsonb)
returns text
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  created_student_id text;
begin
  insert into public.registration_submissions (
    first_name,
    middle_name,
    last_name,
    age,
    gender,
    email,
    country_code,
    phone,
    full_address,
    course,
    course_title_full,
    course_price,
    referral_source,
    has_laptop,
    time_commitment,
    fee_agreement,
    message,
    receipt_image_data_url
  )
  values (
    payload ->> 'first_name',
    payload ->> 'middle_name',
    payload ->> 'last_name',
    (payload ->> 'age')::smallint,
    payload ->> 'gender',
    lower(payload ->> 'email'),
    payload ->> 'country_code',
    payload ->> 'phone',
    payload ->> 'full_address',
    payload ->> 'course',
    payload ->> 'course_title_full',
    payload ->> 'course_price',
    payload ->> 'referral_source',
    payload ->> 'has_laptop',
    payload ->> 'time_commitment',
    payload ->> 'fee_agreement',
    nullif(payload ->> 'message', ''),
    nullif(payload ->> 'receipt_image_data_url', '')
  )
  returning student_id into created_student_id;

  return created_student_id;
end;
$$;

revoke all on function public.submit_registration(jsonb) from public;
grant execute on function public.submit_registration(jsonb) to anon, authenticated;

comment on function public.submit_registration(jsonb) is
  'Public registration intake that returns only the generated student ID; moderation fields remain server-owned.';
