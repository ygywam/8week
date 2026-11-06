-- Apply as the project database owner in the Supabase SQL editor.
-- No client-supplied user id: the authenticated JWT is the sole identity source.
-- Existing application tables reference auth.users with ON DELETE CASCADE.
create or replace function public.delete_own_account()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  caller_id uuid := auth.uid();
  deleted_count integer;
begin
  if caller_id is null then
    raise exception 'Authentication required' using errcode = '28000';
  end if;
  delete from auth.users where id = caller_id;
  get diagnostics deleted_count = row_count;
  if deleted_count <> 1 then
    raise exception 'Account deletion failed';
  end if;
  return pg_catalog.jsonb_build_object('deleted', true);
end;
$$;
revoke all on function public.delete_own_account() from public, anon, authenticated;
grant execute on function public.delete_own_account() to authenticated;
