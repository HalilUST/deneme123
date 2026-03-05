-- Enable row level security for tables

alter table public.users enable row level security;
-- allow users to update their own profile
create policy "users can manage own profile" on public.users
  for all
  using (auth.uid() = id);

alter table public.posts enable row level security;
create policy "public read posts" on public.posts
  for select using (true);
create policy "users can insert own posts" on public.posts
  for insert with check (auth.uid() = user_id);
create policy "users can update delete own posts" on public.posts
  for update, delete using (auth.uid() = user_id);

alter table public.follows enable row level security;
create policy "users can manage follows" on public.follows
  for all using (
    auth.uid() = follower_id
  );

alter table public.comments enable row level security;
create policy "public read comments" on public.comments
  for select using (true);
create policy "users can insert comments" on public.comments
  for insert with check (auth.uid() = user_id);
create policy "users can edit own comments" on public.comments
  for update, delete using (auth.uid() = user_id);

alter table public.likes enable row level security;
create policy "users can like/unlike" on public.likes
  for all using (auth.uid() = user_id);
