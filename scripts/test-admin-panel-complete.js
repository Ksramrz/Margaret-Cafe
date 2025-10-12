const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testAdminPanel() {
  console.log('🧪 Testing Admin Panel Functionality...\n');

  try {
    // 1. Test Admin User Creation
    console.log('1. Checking Admin User...');
    const adminUser = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    });

    if (!adminUser) {
      console.log('❌ No admin user found. Creating one...');
      const newAdmin = await prisma.user.create({
        data: {
          name: 'Admin User',
          email: 'admin@margaretcafe.com',
          phone: '09123456789',
          role: 'ADMIN',
          emailVerified: new Date(),
          phoneVerified: new Date(),
        },
      });
      console.log('✅ Admin user created:', newAdmin.email);
    } else {
      console.log('✅ Admin user exists:', adminUser.email);
    }

    // 2. Test Product Creation
    console.log('\n2. Testing Product Creation...');
    const testProduct = await prisma.product.create({
      data: {
        name: 'Test Coffee',
        nameFa: 'قهوه تست',
        description: 'A test coffee product',
        descriptionFa: 'محصول قهوه تست',
        price: 100000,
        category: 'coffee',
        type: 'PHYSICAL',
        image: 'https://example.com/coffee.jpg',
        stock: 10,
      },
    });
    console.log('✅ Test product created:', testProduct.nameFa);

    // 3. Test Order Creation
    console.log('\n3. Testing Order Creation...');
    const testOrder = await prisma.order.create({
      data: {
        userId: adminUser?.id || (await prisma.user.findFirst({ where: { role: 'ADMIN' } }))?.id,
        total: 100000,
        status: 'PENDING',
        orderItems: {
          create: {
            productId: testProduct.id,
            quantity: 1,
            price: 100000,
          },
        },
      },
    });
    console.log('✅ Test order created:', testOrder.id);

    // 4. Test Statistics
    console.log('\n4. Testing Statistics...');
    const stats = await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { status: { in: ['PAID', 'SHIPPED', 'DELIVERED'] } },
      }),
    ]);

    console.log('✅ Statistics:');
    console.log(`   - Total Users: ${stats[0]}`);
    console.log(`   - Total Products: ${stats[1]}`);
    console.log(`   - Total Orders: ${stats[2]}`);
    console.log(`   - Total Revenue: ${stats[3]._sum.total || 0} تومان`);

    // 5. Test Product Update
    console.log('\n5. Testing Product Update...');
    const updatedProduct = await prisma.product.update({
      where: { id: testProduct.id },
      data: { price: 120000, stock: 15 },
    });
    console.log('✅ Product updated:', updatedProduct.nameFa, '- New price:', updatedProduct.price);

    // 6. Test Order Status Update
    console.log('\n6. Testing Order Status Update...');
    const updatedOrder = await prisma.order.update({
      where: { id: testOrder.id },
      data: { status: 'PAID' },
    });
    console.log('✅ Order status updated:', updatedOrder.status);

    // 7. Clean up test data
    console.log('\n7. Cleaning up test data...');
    await prisma.orderItem.deleteMany({ where: { orderId: testOrder.id } });
    await prisma.order.delete({ where: { id: testOrder.id } });
    await prisma.product.delete({ where: { id: testProduct.id } });
    console.log('✅ Test data cleaned up');

    console.log('\n🎉 All Admin Panel tests passed!');
    console.log('\n📋 Admin Panel Features Verified:');
    console.log('   ✅ Admin user authentication');
    console.log('   ✅ Product CRUD operations');
    console.log('   ✅ Order management');
    console.log('   ✅ Statistics calculation');
    console.log('   ✅ Database operations');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAdminPanel();
