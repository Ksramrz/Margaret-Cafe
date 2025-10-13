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
        
        const product = await prisma.product.create({
          data: {
            name,
            nameFa,
            description,
            descriptionFa,
            price: parseInt(price),
            category,
            type: type || 'PHYSICAL',
            image,
            stock: parseInt(stock),
            featured: featured || false,
          },
        });
        
        return res.status(201).json(product);
      } catch (error) {
        console.error('Error creating product:', error);
        return res.status(500).json({ message: 'Error creating product' });
      }

    case 'PUT':
      try {
        const { id, ...updateData } = req.body;
        
        const product = await prisma.product.update({
          where: { id },
          data: {
            ...updateData,
            price: updateData.price ? parseInt(updateData.price) : undefined,
            stock: updateData.stock ? parseInt(updateData.stock) : undefined,
          },
        });
        
        return res.status(200).json(product);
      } catch (error) {
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
