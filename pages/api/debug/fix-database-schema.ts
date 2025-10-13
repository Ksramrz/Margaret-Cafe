import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    console.log('🔧 Checking and fixing database schema...');
    
    // Check if featured column exists
    const result = await prisma.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'Product' AND column_name = 'featured'
    ` as Array<{ column_name: string }>;
    
    if (result.length === 0) {
      console.log('❌ Featured column does not exist, adding it...');
      
      // Add the featured column
      await prisma.$queryRaw`
        ALTER TABLE "Product" ADD COLUMN "featured" BOOLEAN DEFAULT false
      `;
      
      console.log('✅ Featured column added successfully');
      
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
    } else {
      console.log('✅ Featured column already exists');
    }
    
    // Test creating a product to make sure everything works
    const testProduct = await prisma.product.create({
      data: {
        name: 'Test Product',
        nameFa: 'محصول تست',
        description: 'Test description',
        descriptionFa: 'توضیحات تست',
        price: 1000,
        category: 'coffee',
        type: 'PHYSICAL',
        stock: 10,
        featured: true,
        image: 'https://example.com/test.jpg'
      }
    });
    
    console.log('✅ Test product created successfully:', testProduct.id);
    
    // Clean up test product
    await prisma.product.delete({
      where: { id: testProduct.id }
    });
    
    console.log('✅ Test product cleaned up');
    
    return res.status(200).json({
      message: 'Database schema check completed successfully',
      featuredColumnExists: result.length > 0,
      testProductCreated: true
    });
    
  } catch (error: any) {
    console.error('❌ Database schema check failed:', error);
    
    return res.status(500).json({
      message: 'Database schema check failed',
      error: error.message,
      stack: error.stack
    });
  }
}
