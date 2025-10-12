# Render Deployment Configuration

## Build Settings
- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Node Version**: 18.x

## Environment Variables
Set these in your Render dashboard:

### Required
```
DATABASE_URL=postgresql://username:password@hostname:port/database
NEXTAUTH_URL=https://your-app-name.onrender.com
NEXTAUTH_SECRET=your-secret-key-here
```

### Optional
```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
ZARINPAL_MERCHANT_ID=your-merchant-id
ZARINPAL_SANDBOX=true
```

## Database
- Use PostgreSQL database service on Render
- Prisma will automatically migrate the database
- Admin user will be created automatically

## Deployment Steps
1. Connect your GitHub repository to Render
2. Create a PostgreSQL database service
3. Set environment variables
4. Deploy the web service
5. Access your app at the provided URL
