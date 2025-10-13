# Google OAuth Setup Guide for Margaret Café

## 🔑 Required Google OAuth Credentials

To enable Google signup/login, you need to set up Google OAuth and add these environment variables:

### Environment Variables Needed:
```bash
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

## 📋 Step-by-Step Google OAuth Setup:

### 1. 🌐 Go to Google Cloud Console
- Visit: https://console.cloud.google.com/
- Sign in with your Google account

### 2. 🆕 Create a New Project (or select existing)
- Click "Select a project" → "New Project"
- Project name: "Margaret Café"
- Click "Create"

### 3. 🔧 Enable Google+ API
- Go to "APIs & Services" → "Library"
- Search for "Google+ API" or "Google Identity"
- Click "Enable"

### 4. 🔐 Create OAuth 2.0 Credentials
- Go to "APIs & Services" → "Credentials"
- Click "Create Credentials" → "OAuth 2.0 Client IDs"
- Application type: "Web application"
- Name: "Margaret Café Web App"

### 5. 🌍 Configure Authorized URLs
Add these URLs to "Authorized JavaScript origins":
```
http://localhost:3000
https://margaret-cafe.onrender.com
```

Add these URLs to "Authorized redirect URIs":
```
http://localhost:3000/api/auth/callback/google
https://margaret-cafe.onrender.com/api/auth/callback/google
```

### 6. 📋 Copy Your Credentials
After creating, you'll get:
- **Client ID**: Copy this to `GOOGLE_CLIENT_ID`
- **Client Secret**: Copy this to `GOOGLE_CLIENT_SECRET`

### 7. 🔧 Add to Render Environment Variables
In your Render dashboard:
1. Go to your web service
2. Click "Environment" tab
3. Add these variables:
   - `GOOGLE_CLIENT_ID` = your_client_id
   - `GOOGLE_CLIENT_SECRET` = your_client_secret

## ✅ Current Status Check:

The Google provider is conditionally enabled in `lib/auth.ts`:
```typescript
...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? [
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  })
] : []),
```

## 🧪 Test Google Authentication:

Once configured, users can:
1. Go to `/auth/signin` or `/auth/signup`
2. Click "Sign in with Google" button
3. Complete Google OAuth flow
4. Be automatically logged in

## 🔍 Debugging:

If Google auth doesn't work:
1. Check environment variables are set in Render
2. Verify redirect URIs match exactly
3. Check Google Cloud Console for error logs
4. Test with localhost first, then production

## 📞 Need Help?

If you need assistance setting up Google OAuth:
1. Follow the steps above
2. Share any error messages you encounter
3. I can help troubleshoot the configuration
