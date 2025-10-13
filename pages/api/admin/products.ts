import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || (session.user as any)?.role !== 'ADMIN') {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  switch (req.method) {
    case 'GET':
      try {
        const products = await prisma.product.findMany({
          orderBy: { createdAt: 'desc' },
        });
        return res.status(200).json(products);
      } catch (error) {
        return res.status(500).json({ message: 'Error fetching products' });
      }

    case 'POST':
      try {
        const { name, nameFa, description, descriptionFa, price, category, type, image, stock, featured } = req.body;
        
        // Validate required fields
        if (!name || !nameFa || !price || !category) {
          return res.status(400).json({ 
            message: 'Missing required fields: name, nameFa, price, and category are required' 
          });
        }
        
        // Validate price and stock are numbers
        const priceNum = parseInt(price);
        const stockNum = parseInt(stock || '0');
        
        if (isNaN(priceNum) || priceNum < 0) {
          return res.status(400).json({ 
            message: 'Price must be a valid positive number' 
          });
        }
        
        if (isNaN(stockNum) || stockNum < 0) {
          return res.status(400).json({ 
            message: 'Stock must be a valid positive number' 
          });
        }
        
        // Create product data object
        const productData: any = {
          name: name.trim(),
          nameFa: nameFa.trim(),
          description: description?.trim() || '',
          descriptionFa: descriptionFa?.trim() || '',
          price: priceNum,
          category: category.trim(),
          type: type || 'PHYSICAL',
          image: image?.trim() || '',
          stock: stockNum,
        };
        
        // Only add featured if it exists in the database
        if (featured !== undefined) {
          productData.featured = Boolean(featured);
        }
        
        console.log('Creating product with data:', productData);
        
        const product = await prisma.product.create({
          data: productData,
        });
        
        console.log('Product created successfully:', product.id);
        return res.status(201).json(product);
      } catch (error: any) {
        console.error('Error creating product:', error);
        
        // Handle specific Prisma errors
        if (error.code === 'P2002') {
          return res.status(400).json({ 
            message: 'A product with this name already exists' 
          });
        }
        
        if (error.code === 'P2025') {
          return res.status(400).json({ 
            message: 'Invalid category or type specified' 
          });
        }
        
        return res.status(500).json({ 
          message: 'Error creating product',
          error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
      }

    case 'PUT':
      try {
        const { id, ...updateData } = req.body;
        
        // Prepare update data
        const updateFields: any = {
          ...updateData,
          price: updateData.price ? parseInt(updateData.price) : undefined,
          stock: updateData.stock ? parseInt(updateData.stock) : undefined,
        };
        
        // Only update featured if it's provided
        if (updateData.featured !== undefined) {
          updateFields.featured = updateData.featured;
        }
        
        const product = await prisma.product.update({
          where: { id },
          data: updateFields,
        });
        
        return res.status(200).json(product);
      } catch (error) {
        console.error('Error updating product:', error);
        return res.status(500).json({ message: 'Error updating product' });
      }

    case 'DELETE':
      try {
        const { id } = req.query;
        
        await prisma.product.delete({
          where: { id: id as string },
        });
        
        return res.status(200).json({ message: 'Product deleted successfully' });
      } catch (error) {
        return res.status(500).json({ message: 'Error deleting product' });
      }

    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}
