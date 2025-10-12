import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    // Check if admin user already exists
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    });

    if (existingAdmin) {
      console.log('Admin user already exists:');
      console.log('Email:', existingAdmin.email);
      console.log('Phone:', existingAdmin.phone);
      console.log('Role:', existingAdmin.role);
      return;
    }

    // Create admin user
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

    console.log('Admin user created successfully!');
    console.log('Email:', adminUser.email);
    console.log('Phone:', adminUser.phone);
    console.log('Role:', adminUser.role);
    console.log('\nYou can now login with:');
    console.log('Email: admin@margaretcafe.com');
    console.log('Phone: 09123456789');
    console.log('Password: (any password - authentication is handled by NextAuth)');
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();
