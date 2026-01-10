# 🚀 Google OAuth Production Setup Guide

## Current Issue
After Google login, you're being redirected to `localhost` instead of your production Vercel URL.

## Required Steps

### 1. Add Environment Variable to Railway Backend

Go to your Railway dashboard and add this environment variable:

**Railway Backend Environment Variables:**
```
FRONTEND_URL=https://flashbites.vercel.app
```
(Replace with your actual Vercel URL if different)

### 2. Update Google Cloud Console OAuth Settings

You need to add production URLs to your Google OAuth app:

#### Steps:
1. Go to: https://console.cloud.google.com/apis/credentials
2. Click on your OAuth 2.0 Client ID
3. Under **Authorized redirect URIs**, add:
   ```
   https://flashbites-backend.up.railway.app/api/auth/google/callback
   ```
4. Under **Authorized JavaScript origins**, add:
   ```
   https://flashbites.vercel.app
   https://flashbites-backend.up.railway.app
   ```
5. Click **Save**

### 3. Verify Environment Variables in Railway

Make sure Railway has these Google OAuth variables:
```
GOOGLE_CLIENT_ID=your_actual_client_id
GOOGLE_CLIENT_SECRET=your_actual_client_secret
BACKEND_URL=https://flashbites-backend.up.railway.app
FRONTEND_URL=https://flashbites.vercel.app
```

### 4. Verify Environment Variables in Vercel

Make sure Vercel has:
```
VITE_API_URL=https://flashbites-backend.up.railway.app/api
```

## How OAuth Flow Works

1. User clicks "Continue with Google" on your frontend
2. Frontend redirects to: `https://flashbites-backend.up.railway.app/api/auth/google`
3. User authenticates with Google
4. Google redirects back to: `https://flashbites-backend.up.railway.app/api/auth/google/callback`
5. Backend generates JWT tokens and redirects to: `https://flashbites.vercel.app/auth/google/success?token=...&refresh=...`
6. Frontend saves tokens and logs user in

## Testing After Setup

1. Go to https://flashbites.vercel.app/login
2. Click "Continue with Google"
3. After Google authentication, you should be redirected back to your app (not localhost)

## Quick Access Links

- **Google Cloud Console**: https://console.cloud.google.com/apis/credentials
- **Railway Dashboard**: https://railway.app/dashboard
- **Vercel Dashboard**: https://vercel.com/dashboard

---

**Note:** After adding the `FRONTEND_URL` variable in Railway, the backend will automatically redeploy and the OAuth flow should work! 🎉
