import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { category, featured } = req.query;
    
    // Build where clause
    const where: any = {
      isActive: true, // Only show active products
    };
    
    if (category && category !== 'all') {
      where.category = category;
    }
    
    if (featured === 'true') {
      where.featured = true;
    }
    
    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    
    // Transform products to match frontend expectations
    const transformedProducts = products.map(product => ({
      id: product.id,
      name: product.nameFa || product.name,
      nameEn: product.name,
      description: product.descriptionFa || product.description || '',
      price: product.price,
      currency: 'IRR',
      category: product.category,
      type: product.type,
      image: product.image || '/images/placeholder-product.jpg',
      stock: product.stock,
      featured: product.featured,
      isActive: product.isActive,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }));
    
    return res.status(200).json(transformedProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({ message: 'Error fetching products' });
  }
}
