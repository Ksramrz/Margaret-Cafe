const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function databaseOverview() {
  console.log('📊 Database Overview - Margaret Café\n');

  try {
    // Users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            orders: true,
          },
        },
      },
    });

    console.log('👥 USERS:');
    console.log(`   Total Users: ${users.length}`);
    users.forEach(user => {
      console.log(`   - ${user.name || 'No Name'} (${user.email}) - ${user.role} - ${user._count.orders} orders`);
    });

    // Products
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        nameFa: true,
        price: true,
        category: true,
        type: true,
        stock: true,
        createdAt: true,
      },
    });

    console.log('\n🛍️ PRODUCTS:');
    console.log(`   Total Products: ${products.length}`);
    products.forEach(product => {
      console.log(`   - ${product.nameFa || product.name} - ${product.price} تومان - Stock: ${product.stock}`);
    });

    // Orders
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        orderItems: {
          include: {
            product: {
              select: {
                name: true,
                nameFa: true,
              },
            },
          },
        },
      },
    });

    console.log('\n📦 ORDERS:');
    console.log(`   Total Orders: ${orders.length}`);
    orders.forEach(order => {
      console.log(`   - Order ${order.id.slice(-8)} - ${order.user.name} - ${order.total} تومان - ${order.status}`);
      order.orderItems.forEach(item => {
        console.log(`     * ${item.product.nameFa || item.product.name} x${item.quantity}`);
      });
    });

    // Blog Posts
    const blogPosts = await prisma.blogPost.findMany({
      select: {
        id: true,
        title: true,
        titleFa: true,
        category: true,
        publishedAt: true,
        language: true,
      },
    });

    console.log('\n📝 BLOG POSTS:');
    console.log(`   Total Blog Posts: ${blogPosts.length}`);
    blogPosts.forEach(post => {
      console.log(`   - ${post.titleFa || post.title} - ${post.category} - ${post.language}`);
    });

    // Courses
    const courses = await prisma.course.findMany({
      select: {
        id: true,
        title: true,
        titleFa: true,
        price: true,
        level: true,
        duration: true,
        createdAt: true,
      },
    });

    console.log('\n🎓 COURSES:');
    console.log(`   Total Courses: ${courses.length}`);
    courses.forEach(course => {
      console.log(`   - ${course.titleFa || course.title} - ${course.price} تومان - ${course.level}`);
    });

    // Statistics
    const stats = await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.order.count(),
      prisma.blogPost.count(),
      prisma.course.count(),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { status: { in: ['PAID', 'SHIPPED', 'DELIVERED'] } },
      }),
    ]);

    console.log('\n📈 SUMMARY STATISTICS:');
    console.log(`   👥 Total Users: ${stats[0]}`);
    console.log(`   🛍️ Total Products: ${stats[1]}`);
    console.log(`   📦 Total Orders: ${stats[2]}`);
    console.log(`   📝 Total Blog Posts: ${stats[3]}`);
    console.log(`   🎓 Total Courses: ${stats[4]}`);
    console.log(`   💰 Total Revenue: ${stats[5]._sum.total || 0} تومان`);

    console.log('\n✅ Database overview completed!');

  } catch (error) {
    console.error('❌ Error fetching database overview:', error);
  } finally {
    await prisma.$disconnect();
  }
}

databaseOverview();
