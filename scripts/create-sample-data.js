import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createSampleData() {
  try {
    console.log('Creating sample data...');

    // Create sample products
    const products = await Promise.all([
      prisma.product.create({
        data: {
          name: 'Turkish Coffee Premium',
          nameFa: 'قهوه ترک ممتاز',
          description: 'Authentic Turkish coffee with traditional brewing method',
          descriptionFa: 'قهوه ترک اصیل با روش دم‌آوری سنتی',
          price: 250000, // 250,000 Toman
          category: 'COFFEE',
          type: 'PHYSICAL',
          stock: 50,
          isActive: true,
        },
      }),
      prisma.product.create({
        data: {
          name: 'Persian Tea Collection',
          nameFa: 'مجموعه چای ایرانی',
          description: 'Premium Persian tea from northern Iran gardens',
          descriptionFa: 'چای ممتاز ایرانی از باغات شمال ایران',
          price: 180000, // 180,000 Toman
          category: 'TEA',
          type: 'PHYSICAL',
          stock: 30,
          isActive: true,
        },
      }),
      prisma.product.create({
        data: {
          name: 'Barista Master Course',
          nameFa: 'دوره استادی بارستا',
          description: 'Complete barista training from beginner to professional',
          descriptionFa: 'آموزش کامل بارستا از مبتدی تا حرفه‌ای',
          price: 1200000, // 1,200,000 Toman
          category: 'COURSE',
          type: 'COURSE',
          stock: 0,
          isActive: true,
        },
      }),
    ]);

    console.log('✅ Created', products.length, 'products');

    // Create sample orders
    const adminUser = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    });

    if (adminUser) {
      const orders = await Promise.all([
        prisma.order.create({
          data: {
            userId: adminUser.id,
            status: 'PAID',
            total: 250000,
            paymentId: 'ZP123456789',
            orderItems: {
              create: {
                productId: products[0].id,
                quantity: 1,
                price: 250000,
              },
            },
          },
        }),
        prisma.order.create({
          data: {
            userId: adminUser.id,
            status: 'PENDING',
            total: 180000,
            orderItems: {
              create: {
                productId: products[1].id,
                quantity: 1,
                price: 180000,
              },
            },
          },
        }),
      ]);

      console.log('✅ Created', orders.length, 'orders');
    }

    // Create sample blog posts
    const blogPosts = await Promise.all([
      prisma.blogPost.create({
        data: {
          title: 'The Art of Turkish Coffee',
          titleFa: 'هنر قهوه ترک',
          slug: 'art-of-turkish-coffee',
          content: 'Turkish coffee is more than just a drink...',
          contentFa: 'قهوه ترک چیزی بیش از یک نوشیدنی است...',
          excerpt: 'Learn the traditional method of brewing Turkish coffee',
          excerptFa: 'روش سنتی دم‌آوری قهوه ترک را بیاموزید',
          authorId: adminUser?.id || '',
          category: 'COFFEE',
          tags: '["turkish", "coffee", "traditional"]',
          publishedAt: new Date(),
          readTime: 5,
          language: 'FA',
        },
      }),
      prisma.blogPost.create({
        data: {
          title: 'Persian Tea Culture',
          titleFa: 'فرهنگ چای ایرانی',
          slug: 'persian-tea-culture',
          content: 'Tea holds a special place in Persian culture...',
          contentFa: 'چای جایگاه ویژه‌ای در فرهنگ ایرانی دارد...',
          excerpt: 'Discover the rich history of tea in Iran',
          excerptFa: 'تاریخچه غنی چای در ایران را کشف کنید',
          authorId: adminUser?.id || '',
          category: 'TEA',
          tags: '["persian", "tea", "culture"]',
          publishedAt: new Date(),
          readTime: 7,
          language: 'FA',
        },
      }),
    ]);

    console.log('✅ Created', blogPosts.length, 'blog posts');

    console.log('\n🎉 Sample data created successfully!');
    console.log('Now you can login to the admin panel and see real data.');

  } catch (error) {
    console.error('Error creating sample data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSampleData();

