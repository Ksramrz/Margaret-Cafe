import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
  
  const isConfigured = !!(googleClientId && googleClientSecret);
  
  return res.status(200).json({
    message: 'Google OAuth Configuration Status',
    configured: isConfigured,
    hasClientId: !!googleClientId,
    hasClientSecret: !!googleClientSecret,
    clientIdLength: googleClientId?.length || 0,
    clientSecretLength: googleClientSecret?.length || 0,
    instructions: isConfigured 
      ? 'Google OAuth is configured and ready to use!'
      : 'Google OAuth needs to be configured. Check GOOGLE_OAUTH_SETUP.md for instructions.',
    nextSteps: isConfigured 
      ? ['Visit /auth/signin or /auth/signup to test Google login']
      : [
          '1. Go to Google Cloud Console',
          '2. Create OAuth 2.0 credentials',
          '3. Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to environment variables',
          '4. Redeploy the application'
        ],
    environmentVariables: {
      GOOGLE_CLIENT_ID: googleClientId ? `${googleClientId.substring(0, 10)}...` : 'Not set',
      GOOGLE_CLIENT_SECRET: googleClientSecret ? `${googleClientSecret.substring(0, 10)}...` : 'Not set',
    }
  });
}
