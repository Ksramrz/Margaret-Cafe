# Margaret Café - Next.js Application

## Environment Variables Required

Create these environment variables in your Render dashboard:

### Database
```
DATABASE_URL=postgresql://username:password@hostname:port/database
```

### NextAuth
```
NEXTAUTH_URL=https://your-app-name.onrender.com
NEXTAUTH_SECRET=your-secret-key-here
```

### Google OAuth (Optional)
```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Zarinpal Payment (Optional)
```
ZARINPAL_MERCHANT_ID=your-merchant-id
ZARINPAL_SANDBOX=true
```

## Build Commands
- Build Command: `npm run build`
- Start Command: `npm start`

## Database Setup
The app will automatically run Prisma migrations on deployment.