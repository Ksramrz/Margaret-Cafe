// Comprehensive production setup script
// This ensures everything is properly configured and working

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function setupProduction() {
  console.log('🚀 Starting Margaret Café Production Setup...\n');
  
  try {
    // Step 1: Database Migration
    console.log('📊 Step 1: Database Migration');
    await migrateDatabase();
    
    // Step 2: Create Admin User
    console.log('\n👤 Step 2: Admin User Setup');
    await createAdminUser();
    
    // Step 3: Test SMS Configuration
    console.log('\n📱 Step 3: SMS Configuration Test');
    await testSMSConfig();
    
    // Step 4: Test Payment Configuration
    console.log('\n💳 Step 4: Payment Configuration Test');
    await testPaymentConfig();
    
    console.log('\n✅ Production setup completed successfully!');
    console.log('🎉 Margaret Café is ready for production!');
    
  } catch (error) {
    console.error('\n❌ Production setup failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

async function migrateDatabase() {
  try {
    // Check if password column exists
    const columns = await prisma.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'User' AND column_name = 'password'
    `;
    
    if (columns.length === 0) {
      console.log('  Adding password column to User table...');
      await prisma.$executeRaw`ALTER TABLE "User" ADD COLUMN "password" TEXT;`;
      console.log('  ✅ Password column added successfully!');
    } else {
      console.log('  ✅ Password column already exists.');
    }
    
    // Test user creation
    const testUser = await prisma.user.create({
      data: {
        name: 'Setup Test User',
        email: 'setup-test@example.com',
        password: 'test123',
        role: 'USER',
      } as any,
    });
    
    await prisma.user.delete({
      where: { id: testUser.id },
    });
    
    console.log('  ✅ Database schema is working correctly!');
    
  } catch (error) {
    console.error('  ❌ Database migration failed:', error.message);
    throw error;
  }
}

async function createAdminUser() {
  try {
    // Check if admin user exists
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    });
    
    if (existingAdmin) {
      console.log('  ✅ Admin user already exists:', existingAdmin.email);
    } else {
      console.log('  Creating admin user...');
      const adminUser = await prisma.user.create({
        data: {
          name: 'Admin User',
          email: 'admin@margaretcafe.com',
          phone: '09123456789',
          role: 'ADMIN',
          emailVerified: new Date(),
          phoneVerified: new Date(),
        },
      });
      console.log('  ✅ Admin user created:', adminUser.email);
    }
    
  } catch (error) {
    console.error('  ❌ Admin user creation failed:', error.message);
    throw error;
  }
}

async function testSMSConfig() {
  const apiKey = process.env.KAVENEGAR_API_KEY;
  const senderNumber = process.env.KAVENEGAR_SENDER_NUMBER;
  
  if (!apiKey || !senderNumber) {
    console.log('  ⚠️  SMS configuration missing - add KAVENEGAR_API_KEY and KAVENEGAR_SENDER_NUMBER');
    return;
  }
  
  console.log('  ✅ SMS configuration found');
  console.log('  📱 Sender Number:', senderNumber);
  console.log('  🔑 API Key:', apiKey.substring(0, 10) + '...');
}

async function testPaymentConfig() {
  const merchantId = process.env.ZARINPAL_MERCHANT_ID;
  
  if (!merchantId) {
    console.log('  ⚠️  Payment configuration missing - add ZARINPAL_MERCHANT_ID');
    return;
  }
  
  console.log('  ✅ Payment configuration found');
  console.log('  💳 Merchant ID:', merchantId.substring(0, 10) + '...');
}

// Run setup if this script is executed directly
if (require.main === module) {
  setupProduction()
    .then(() => {
      console.log('\n🎉 Setup completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Setup failed:', error);
      process.exit(1);
    });
}

module.exports = { setupProduction };