import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    console.log('Checking and creating VerificationCode table...');
    
    // Check if VerificationCode table exists
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'VerificationCode'
    `;
    
    if (tables.length === 0) {
      console.log('Creating VerificationCode table...');
      
      // Create VerificationCode table
      await prisma.$executeRaw`
        CREATE TABLE "VerificationCode" (
          "id" TEXT NOT NULL,
          "phone" TEXT NOT NULL,
          "code" TEXT NOT NULL,
          "expiresAt" TIMESTAMP(3) NOT NULL,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "VerificationCode_pkey" PRIMARY KEY ("id")
        )
      `;
      
      console.log('✅ VerificationCode table created successfully!');
    } else {
      console.log('✅ VerificationCode table already exists.');
    }
    
    // Test verification code creation
    console.log('Testing verification code creation...');
    const testCode = await prisma.verificationCode.create({
      data: {
        phone: 'test-phone',
        code: '123456',
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      },
    });
    
    // Clean up test code
    await prisma.verificationCode.delete({
      where: { id: testCode.id },
    });
    
    console.log('✅ VerificationCode operations working correctly!');
    
    return res.status(200).json({
      message: 'VerificationCode table setup completed successfully!',
      success: true,
      tableExists: tables.length > 0,
      testPassed: true,
    });
    
  } catch (error: any) {
    console.error('VerificationCode setup failed:', error);
    
    return res.status(500).json({
      message: 'VerificationCode setup failed',
      error: error.message,
      code: error.code,
    });
  }
}
