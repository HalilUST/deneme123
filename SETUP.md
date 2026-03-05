# 🚀 Blog Platform - Firebase Setup Guide

## Overview
Full-stack blog platform with:
- **Next.js 14** (Frontend)
- **Firebase Firestore** (Database)
- **Firebase Auth** (Authentication)
- **Vercel** (Hosting)
- **Tailwind CSS** (Styling)

All completely **FREE** tier!

---

## 1️⃣ Setup Firebase Project

### Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **"Create Project"**
3. Name it (e.g., "blog-platform")
4. Disable Google Analytics (optional)
5. Click **"Create"** and wait

### Get Web App Config
1. In Firebase Console, click **"Web"** icon (like `</>`)</span>
2. Register app name (e.g., "blog-web")
3. Copy the config code (we'll need this)
4. Don't click "Continue to console" yet

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "blog-platform.firebaseapp.com",
  projectId: "blog-platform",
  storageBucket: "blog-platform.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123def456"
};
```

---

## 2️⃣ Enable Firestore Database

1. **Firebase Console** → **Build** → **Firestore Database**
2. Click **"Create Database"**
3. Select **"Start in test mode"** (development)
4. Choose region: **us-central1** or closest to you
5. Click **"Create"**

### Create Collections Manually

In Firestore, create these empty collections (no documents yet):

1. **users**
2. **posts**
3. **follows**
4. **comments**

---

## 3️⃣ Enable Authentication

1. **Firebase Console** → **Build** → **Authentication**
2. Click **"Get Started"**
3. Select **"Email/Password"**
4. Toggle **Enable** → Click **Save**

---

## 4️⃣ Setup Project Locally

### Clone & Install
```bash
git clone https://github.com/HalilUST/deneme123.git
cd visual
npm install
```

### Create `.env.local`
Copy Firebase config values into `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=blog-platform.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=blog-platform
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=blog-platform.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc...
```

### Run Locally
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 5️⃣ Test the App

1. **Register** at `/register`
   - Email: `test@example.com`
   - Password: `password123`
   - Username: `testuser`

2. **Login** at `/login`

3. **Create Post** at `/dashboard/write`
   - Title: "My First Post"
   - Content: "Hello World!"

4. **View Feed** at `/dashboard/feed`

5. **Explore Users** at `/dashboard/explore`

---

## 6️⃣ Deploy to Vercel

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Firebase blog platform"
git push origin main
```

### Step 2: Deploy on Vercel
1. Go to [vercel.com](https://vercel.com)
2. Login with GitHub
3. Click **"Add New Project"**
4. Select your `deneme123` repo
5. Click **"Import"**

### Step 3: Add Environment Variables
1. On deployment screen → **Environment Variables**
2. Add all 6 Firebase values:
   - NEXT_PUBLIC_FIREBASE_API_KEY
   - NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
   - NEXT_PUBLIC_FIREBASE_PROJECT_ID
   - NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
   - NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
   - NEXT_PUBLIC_FIREBASE_APP_ID

3. Click **"Deploy"**

🎉 Your site is live! Check the provided URL.

---

## 🔐 Important: Update Firestore Security Rules

For production, go to **Firestore → Rules** and paste:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read profiles
    match /users/{userId} {
      allow read: if request.auth != null;
      allow create: if request.auth.uid == userId;
      allow update, delete: if request.auth.uid == userId;
    }

    // Posts: public read, auth users can create own
    match /posts/{postId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.resource.data.user_id == request.auth.uid;
      allow update, delete: if request.auth.uid == resource.data.user_id;
    }

    // Follows: authenticated users can follow/unfollow
    match /follows/{docId} {
      allow read: if request.auth != null;
      allow create, delete: if request.auth.uid == request.resource.data.follower_id;
    }

    // Comments: public read, auth users can comment
    match /comments/{commentId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.resource.data.user_id == request.auth.uid;
      allow update, delete: if request.auth.uid == resource.data.user_id;
    }
  }
}
```

Click **"Publish"**.

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/
│   │   ├── feed/
│   │   ├── explore/
│   │   ├── write/
│   │   └── profile/[username]/
│   ├── blog/[slug]/
│   └── page.tsx
├── components/
│   ├── NavBar.tsx
│   ├── CommentsSection.tsx
│   └── PostControls.tsx
└── lib/
    ├── firebase.ts        (config)
    ├── auth.ts            (auth functions)
    ├── db.ts              (database queries)
    └── types.ts           (TypeScript types)
```

---

## ✨ Features

✅ User Registration & Login  
✅ Create/Edit/Delete Posts  
✅ Follow/Unfollow Users  
✅ Comment on Posts  
✅ View User Profiles  
✅ Feed from Followed Users  
✅ Explore All Users  
✅ Responsive Design  

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Cannot find module 'firebase'" | Run `npm install` |
| "Permission denied" errors | Check Firestore Rules (currently test mode) |
| Register not working | Enable Email/Password in Firebase Auth |
| Posts not showing | Verify "posts" collection exists in Firestore |
| Env variables not loading | Restart `npm run dev` after adding `.env.local` |

---

## 🆓 Free Tier Limits

**Firebase Firestore:**
- 1 GB storage
- 50,000 reads/day
- 20,000 writes/day
- 20,000 deletes/day

**Firebase Auth:**
- Unlimited free users

**Vercel:**
- 100 GB bandwidth/month
- Automatic deployments

This is more than enough for a personal blog!

---

## 📚 Useful Links

- [Firebase Docs](https://firebase.google.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Vercel Docs](https://vercel.com/docs)
- [Tailwind CSS](https://tailwindcss.com)

---

## 🚀 Next Steps

After setup works:

1. Customize styling in `globals.css` and `tailwind.config.js`
2. Add profile pictures (Firebase Storage)
3. Implement likes/reactions
4. Add search functionality
5. Setup custom domain in Vercel
6. Add email notifications

---

**Made with ❤️ | Completely Free & Open Source**
