// Test if the website loads without reloading
console.log('🧪 Testing website stability...');

let reloadCount = 0;
const originalReload = window.location.reload;

window.location.reload = function() {
  reloadCount++;
  console.log(`❌ Page reloaded ${reloadCount} times!`);
  if (reloadCount > 3) {
    console.log('❌ Too many reloads detected - there is a hydration issue');
  }
  return originalReload.call(this);
};

// Check for hydration errors
window.addEventListener('error', (event) => {
  if (event.message.includes('hydration') || event.message.includes('Hydration')) {
    console.log('❌ Hydration error detected:', event.message);
  }
});

console.log('✅ Reload monitoring active - check console for any reloads');
