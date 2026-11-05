-- Run once in a new Supabase project. RLS is enforced for every table.
create table public.profiles (user_id uuid primary key references auth.users(id) on delete cascade, start_date date);
create table public.day_logs (user_id uuid not null references auth.users(id) on delete cascade, day date not null, done boolean not null default false, items jsonb not null default '{}'::jsonb, primary key(user_id,day));
create table public.weights (user_id uuid not null references auth.users(id) on delete cascade, day date not null, kg numeric(5,2) not null check (kg > 0 and kg < 500), primary key(user_id,day));
create table public.chats (id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, title text not null default '새 대화', created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(id,user_id));
create table public.messages (id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, chat_id uuid not null, role text not null check(role in ('user','assistant')), content text not null check(length(content)<=10000), created_at timestamptz not null default now(), foreign key (chat_id,user_id) references public.chats(id,user_id) on delete cascade);
create index messages_chat_order on public.messages(chat_id,created_at);
create index chats_user_order on public.chats(user_id,updated_at desc);
alter table public.profiles enable row level security;
alter table public.day_logs enable row level security;
alter table public.weights enable row level security;
alter table public.chats enable row level security;
alter table public.messages enable row level security;
create policy own_profiles on public.profiles for all to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create policy own_day_logs on public.day_logs for all to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create policy own_weights on public.weights for all to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create policy own_chats on public.chats for all to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create policy own_messages on public.messages for all to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
grant select,insert,update,delete on public.profiles,public.day_logs,public.weights,public.chats,public.messages to authenticated;
-- The reset is transactional; weight and conversation histories are kept.
create function public.reset_plan(new_start date) returns void language plpgsql security invoker set search_path=public as $$ begin
 if auth.uid() is null or new_start is null then raise exception 'Unauthenticated or missing date'; end if;
 delete from public.day_logs where user_id=auth.uid();
 insert into public.profiles(user_id,start_date) values(auth.uid(),new_start) on conflict(user_id) do update set start_date=excluded.start_date;
end $$;
revoke all on function public.reset_plan(date) from public,anon;
grant execute on function public.reset_plan(date) to authenticated;
