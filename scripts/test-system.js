import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testDatabaseFunctionality() {
  console.log('🧪 Testing Database Functionality...\n');

  try {
    // Test 1: Check if admin user exists
    console.log('1️⃣ Testing Admin User...');
    const adminUser = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    });

    if (adminUser) {
      console.log('✅ Admin user found:', adminUser.email);
    } else {
      console.log('❌ No admin user found');
    }

    // Test 2: Check products
    console.log('\n2️⃣ Testing Products...');
    const products = await prisma.product.findMany();
    console.log(`✅ Found ${products.length} products`);

    // Test 3: Check orders
    console.log('\n3️⃣ Testing Orders...');
    const orders = await prisma.order.findMany();
    console.log(`✅ Found ${orders.length} orders`);

    // Test 4: Check users
    console.log('\n4️⃣ Testing Users...');
    const users = await prisma.user.findMany();
    console.log(`✅ Found ${users.length} users`);

    // Test 5: Test admin API endpoints
    console.log('\n5️⃣ Testing Admin API Endpoints...');
    
    // Test stats endpoint
    const statsResponse = await fetch('http://localhost:3000/api/admin/stats');
    if (statsResponse.ok) {
      const stats = await statsResponse.json();
      console.log('✅ Admin stats API working:', stats);
    } else {
      console.log('❌ Admin stats API failed:', statsResponse.status);
    }

    // Test products endpoint
    const productsResponse = await fetch('http://localhost:3000/api/admin/products');
    if (productsResponse.ok) {
      const productsData = await productsResponse.json();
      console.log('✅ Admin products API working:', productsData.length, 'products');
    } else {
      console.log('❌ Admin products API failed:', productsResponse.status);
    }

    console.log('\n🎉 Database functionality test completed!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Test authentication
async function testAuthentication() {
  console.log('\n🔐 Testing Authentication...');
  
  try {
    // Test signin page
    const signinResponse = await fetch('http://localhost:3000/auth/signin');
    if (signinResponse.ok) {
      console.log('✅ Signin page accessible');
    } else {
      console.log('❌ Signin page failed:', signinResponse.status);
    }

    // Test signup page
    const signupResponse = await fetch('http://localhost:3000/auth/signup');
    if (signupResponse.ok) {
      console.log('✅ Signup page accessible');
    } else {
      console.log('❌ Signup page failed:', signupResponse.status);
    }

  } catch (error) {
    console.error('❌ Authentication test failed:', error);
  }
}

// Test payment system
async function testPaymentSystem() {
  console.log('\n💳 Testing Payment System...');
  
  try {
    // Test payment creation (without actual payment)
    const paymentData = {
      amount: 100000,
      description: 'Test payment',
      orderId: null
    };

    const paymentResponse = await fetch('http://localhost:3000/api/payment/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentData)
    });

    if (paymentResponse.status === 401) {
      console.log('✅ Payment API properly requires authentication');
    } else {
      console.log('⚠️ Payment API response:', paymentResponse.status);
    }

  } catch (error) {
    console.error('❌ Payment test failed:', error);
  }
}

// Test SMS system
async function testSMSSystem() {
  console.log('\n📱 Testing SMS System...');
  
  try {
    const smsData = {
      phone: '09123456789'
    };

    const smsResponse = await fetch('http://localhost:3000/api/auth/send-sms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(smsData)
    });

    if (smsResponse.status === 500) {
      console.log('⚠️ SMS API requires Kavenegar configuration');
    } else {
      console.log('✅ SMS API response:', smsResponse.status);
    }

  } catch (error) {
    console.error('❌ SMS test failed:', error);
  }
}

// Main test function
async function runAllTests() {
  console.log('🚀 Starting Margaret Café System Tests...\n');
  
  await testDatabaseFunctionality();
  await testAuthentication();
  await testPaymentSystem();
  await testSMSSystem();
  
  console.log('\n✨ All tests completed!');
  console.log('\n📋 Next Steps:');
  console.log('1. Set up Google OAuth credentials in .env');
  console.log('2. Configure Kavenegar SMS service');
  console.log('3. Set up Zarinpal payment gateway');
  console.log('4. Test admin panel at http://localhost:3000/admin');
  console.log('5. Login with: admin@margaretcafe.com (any password)');
}

runAllTests();



