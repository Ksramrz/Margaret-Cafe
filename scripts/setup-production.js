const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function setupProductionDatabase() {
  console.log('🚀 Setting up production database...\n');

  try {
    // Check if admin user exists
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    });

    if (!existingAdmin) {
      console.log('👤 Creating admin user...');
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
      console.log('✅ Admin user created:', adminUser.email);
    } else {
      console.log('✅ Admin user already exists:', existingAdmin.email);
    }

    // Check if we have products
    const productCount = await prisma.product.count();
    console.log(`📦 Products in database: ${productCount}`);

    if (productCount === 0) {
      console.log('🛍️ Creating sample products...');
      
      const products = [
        {
          name: 'Persian Tea Collection',
          nameFa: 'مجموعه چای ایرانی',
          description: 'Premium Persian tea from northern Iran gardens',
          descriptionFa: 'چای ممتاز ایرانی از باغات شمال ایران',
          price: 180000,
          category: 'TEA',
          type: 'PHYSICAL',
          stock: 30,
        },
        {
          name: 'Turkish Coffee Premium',
          nameFa: 'قهوه ترک ممتاز',
          description: 'Authentic Turkish coffee with traditional brewing method',
          descriptionFa: 'قهوه ترک اصیل با روش دم‌آوری سنتی',
          price: 250000,
          category: 'COFFEE',
          type: 'PHYSICAL',
          stock: 50,
        },
        {
          name: 'Barista Master Course',
          nameFa: 'دوره استادی بارستا',
          description: 'Complete barista training from beginner to professional',
          descriptionFa: 'آموزش کامل بارستا از مبتدی تا حرفه‌ای',
          price: 1200000,
          category: 'COURSE',
          type: 'COURSE',
          stock: 0,
        },
      ];

      for (const product of products) {
        await prisma.product.create({ data: product });
      }
      
      console.log('✅ Sample products created');
    }

    console.log('\n🎉 Production database setup completed!');
    console.log('\n📋 Next steps:');
    console.log('1. Access your app at the Render URL');
    console.log('2. Login with admin@margaretcafe.com');
    console.log('3. Use the admin panel to manage your café');

  } catch (error) {
    console.error('❌ Error setting up database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setupProductionDatabase();
