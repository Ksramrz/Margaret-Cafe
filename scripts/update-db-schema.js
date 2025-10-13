// Script to manually update database schema on Render
// Run this after deployment to add the password field

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateDatabaseSchema() {
  try {
    console.log('Updating database schema...');
    
    // Check if password column exists
    const result = await prisma.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'User' AND column_name = 'password'
    `;
    
    if (result.length === 0) {
      console.log('Adding password column to User table...');
      await prisma.$executeRaw`ALTER TABLE "User" ADD COLUMN "password" TEXT;`;
      console.log('Password column added successfully!');
    } else {
      console.log('Password column already exists.');
    }
    
    console.log('Database schema update completed!');
  } catch (error) {
    console.error('Error updating database schema:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateDatabaseSchema();
