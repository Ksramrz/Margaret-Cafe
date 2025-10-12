// Quick Admin Panel Test
console.log('🧪 Testing Admin Panel Stability...');

// Test 1: Check if admin user exists
fetch('/api/admin/stats')
  .then(res => {
    if (res.status === 401) {
      console.log('✅ Admin authentication working - requires login');
    } else if (res.ok) {
      console.log('✅ Admin panel accessible');
    } else {
      console.log('❌ Admin panel error:', res.status);
    }
  })
  .catch(err => {
    console.log('❌ Network error:', err.message);
  });

// Test 2: Check products endpoint
fetch('/api/admin/products')
  .then(res => {
    if (res.status === 401) {
      console.log('✅ Products endpoint protected');
    } else if (res.ok) {
      console.log('✅ Products endpoint working');
    } else {
      console.log('❌ Products endpoint error:', res.status);
    }
  })
  .catch(err => {
    console.log('❌ Products network error:', err.message);
  });

console.log('✅ Admin Panel tests completed - check console for results');
