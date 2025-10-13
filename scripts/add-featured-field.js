const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addFeaturedField() {
  console.log('🔧 Adding featured field to Product table...');
  
  try {
    // Check if the column already exists
    const result = await prisma.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'Product' AND column_name = 'featured'
    `;
    
    if (result.length > 0) {
      console.log('✅ Featured field already exists in Product table');
      return;
    }
    
    // Add the featured column
    await prisma.$queryRaw`
      ALTER TABLE "Product" ADD COLUMN "featured" BOOLEAN DEFAULT false
    `;
    
    console.log('✅ Featured field added successfully to Product table');
    
    // Update existing products to have featured = false
    await prisma.product.updateMany({
      where: {
        featured: null
      },
      data: {
        featured: false
      }
    });
    
    console.log('✅ Updated existing products with featured = false');
    
  } catch (error) {
    console.error('❌ Error adding featured field:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addFeaturedField();
