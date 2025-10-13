const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const readline = require('readline');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'postgresql://margaret_cafe_db_user:Cgqjwa6a4zrtyvQm5bMbZVnorDvbynWt@dpg-d3mf75ur433s73ajo2g0-a.oregon-postgres.render.com/margaret_cafe_db'
    }
  }
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function updateAdminPassword() {
  try {
    console.log('🔐 Admin Password Update Tool');
    console.log('============================\n');

    // Get new password from user
    const newPassword = await new Promise((resolve) => {
      rl.question('Enter new admin password (min 6 characters): ', resolve);
    });

    if (newPassword.length < 6) {
      console.log('❌ Password must be at least 6 characters long');
      rl.close();
      return;
    }

    const confirmPassword = await new Promise((resolve) => {
      rl.question('Confirm new password: ', resolve);
    });

    if (newPassword !== confirmPassword) {
      console.log('❌ Passwords do not match');
      rl.close();
      return;
    }

    console.log('\n🔄 Updating admin password...');

    // Hash the password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    console.log('✅ Password hashed successfully (length:', hashedPassword.length + ')');

    // Find admin user
    const adminUser = await prisma.user.findFirst({
      where: {
        email: 'admin@margaretcafe.com',
        role: 'ADMIN'
      }
    });

    if (!adminUser) {
      console.log('❌ Admin user not found');
      rl.close();
      return;
    }

    console.log('✅ Admin user found:', adminUser.email);

    // Update password
    const updatedAdmin = await prisma.user.update({
      where: { id: adminUser.id },
      data: {
        password: hashedPassword
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    console.log('✅ Admin password updated successfully!');
    console.log('\n📊 Updated Admin Info:');
    console.log('ID:', updatedAdmin.id);
    console.log('Name:', updatedAdmin.name);
    console.log('Email:', updatedAdmin.email);
    console.log('Role:', updatedAdmin.role);
    console.log('Created:', updatedAdmin.createdAt);

    // Test the password
    const testUser = await prisma.user.findUnique({
      where: { id: adminUser.id }
    });

    const passwordTest = await bcrypt.compare(newPassword, testUser.password);
    console.log('\n🔍 Password verification test:', passwordTest ? '✅ PASSED' : '❌ FAILED');

    console.log('\n🎉 Admin password update completed successfully!');
    console.log('You can now login with:');
    console.log('Email: admin@margaretcafe.com');
    console.log('Password: [your new password]');

  } catch (error) {
    console.error('❌ Error updating admin password:', error.message);
  } finally {
    await prisma.$disconnect();
    rl.close();
  }
}

// Run the script
updateAdminPassword();
