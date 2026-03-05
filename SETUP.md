# Blog Platform - Quick Setup Guide

## Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account

## Environment Setup

### 1. Create `.env.local` in the project root:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Get these from Supabase Dashboard → Settings → API

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Supabase Database

Run these SQL commands in Supabase SQL Editor:

**Create tables:**
```sql
-- users table
create table if not exists public.users (
  id          uuid not null primary key default gen_random_uuid(),
  username    text not null unique,
  email       text not null unique,
  avatar_url  text,
  bio         text,
  created_at  timestamptz not null default now()
);

-- posts table
create table if not exists public.posts (
  id          uuid not null primary key default gen_random_uuid(),
  user_id     uuid not null references public.users(id) on delete cascade,
  title       text not null,
  slug        text not null unique,
  content     text not null,
  cover_image text,
  tags        text[],
  created_at  timestamptz not null default now()
);

create index if not exists idx_posts_user_id on public.posts (user_id);
create index if not exists idx_posts_created_at on public.posts (created_at desc);

-- follows table
create table if not exists public.follows (
  follower_id  uuid not null references public.users(id) on delete cascade,
  following_id uuid not null references public.users(id) on delete cascade,
  created_at   timestamptz not null default now(),
  primary key (follower_id, following_id)
);

create index if not exists idx_follows_follower on public.follows (follower_id);
create index if not exists idx_follows_following on public.follows (following_id);

-- comments table
create table if not exists public.comments (
  id          uuid not null primary key default gen_random_uuid(),
  post_id     uuid not null references public.posts(id) on delete cascade,
  user_id     uuid not null references public.users(id) on delete cascade,
  content     text not null,
  created_at  timestamptz not null default now()
);

create index if not exists idx_comments_post_id on public.comments (post_id);
create index if not exists idx_comments_user_id on public.comments (user_id);

-- likes table
create table if not exists public.likes (
  post_id    uuid not null references public.posts(id) on delete cascade,
  user_id    uuid not null references public.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

create index if not exists idx_likes_post_id on public.likes (post_id);
create index if not exists idx_likes_user_id on public.likes (user_id);
```

**Enable RLS (Row Level Security):**

Check `supabase-policies.sql` file in project root and run those SQL commands in Supabase.

## Running the Project

### Development
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

### Build
```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/
│   ├── (auth)/              # Authentication routes
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/         # Protected routes (after login)
│   │   ├── feed/page.tsx
│   │   ├── explore/page.tsx
│   │   ├── write/page.tsx
│   │   └── profile/[username]/page.tsx
│   ├── blog/[slug]/         # Blog post view
│   ├── api/                 # API routes
│   └── page.tsx             # Redirect to feed/login
├── components/              # Reusable components
├── lib/
│   ├── supabase.ts         # Supabase client setup
│   ├── auth.ts             # Auth helpers
│   ├── db.ts               # Database queries
│   └── types.ts            # TypeScript types
└── middleware.ts            # Route protection
```

## Features Implemented

✅ **Authentication**
- Register with email, password, and username
- Login/Logout
- Session management with Supabase Auth
- Protected routes with middleware

✅ **User Profiles**
- View user profile with bio and avatar
- Show posts by user
- Display follower/following counts
- Follow/unfollow users

✅ **Blog Posts**
- Create and publish posts
- Edit and delete your own posts
- Auto-generated slugs from titles
- View post details

✅ **Feed**
- Display posts from followed users
- Sorted by creation date

✅ **Comments**
- Add comments to posts
- View all comments on a post

✅ **Explore**
- Discover and browse all users
- Find new content creators

## Important Notes

⚠️ **Not Implemented Yet:**
- Image uploads
- Likes system UI
- Post editing UI (backend ready)
- Search functionality
- Tags filtering
- Email verification
- Password reset

## Deployment on Vercel

1. Push to GitHub
2. Go to vercel.com and import the repo
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy!

## Troubleshooting

**"Missing Supabase configuration"**  
→ Check `.env.local` has correct URL and ANON_KEY

**"Cannot find module '@supabase/supabase-js'"**  
→ Run `npm install` and restart dev server

**RLS errors on mutations**  
→ Ensure RLS policies are enabled in Supabase SQL Editor

**Auth not persisting**  
→ Clear browser cookies, check cookie settings in Supabase

---

For more help, check Supabase docs: https://supabase.com/docs
