-- Add password field to User table for Render PostgreSQL
-- This migration adds the password field needed for user signup

ALTER TABLE "User" ADD COLUMN "password" TEXT;

-- Update existing admin user to have a password (optional)
-- UPDATE "User" SET "password" = '$2a$12$hashedpassword' WHERE "email" = 'admin@margaretcafe.com';
