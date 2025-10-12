import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testAdminLogin() {
  try {
    const admin = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    });

    if (admin) {
      console.log('✅ Admin user found:');
      console.log('   Email:', admin.email);
      console.log('   Phone:', admin.phone);
      console.log('   Role:', admin.role);
      console.log('   ID:', admin.id);
      console.log('\n🔑 Login Instructions:');
      console.log('1. Go to: http://localhost:3000/auth/signin');
      console.log('2. Enter Email: admin@margaretcafe.com');
      console.log('3. Enter any password (e.g., "admin123")');
      console.log('4. Click "ورود" (Sign In)');
      console.log('5. You will be redirected to the admin panel');
    } else {
      console.log('❌ No admin user found');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAdminLogin();

