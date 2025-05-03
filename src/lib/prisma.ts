import { PrismaClient } from '@prisma/client';

// This is a placeholder PrismaClient for compatibility 
// In this localStorage implementation, we don't actually use Prisma
// But some imports may still reference this file

// Check if we're in production
const isProduction = process.env.NODE_ENV === 'production';

class MockPrismaClient {
  // Add mock methods that return empty arrays or null
  user = {
    findUnique: async () => null,
    findMany: async () => [],
    create: async (data: any) => data.data,
    update: async (data: any) => data.data,
  };
  
  job = {
    findUnique: async () => null,
    findMany: async () => [],
    create: async (data: any) => data.data,
  };
  
  resume = {
    findUnique: async () => null,
    findMany: async () => [],
    create: async (data: any) => data.data,
  };
}

// Use the global PrismaClient if it exists, otherwise create a new one
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// For the localStorage version, use the mock client
export const prisma = globalForPrisma.prisma || new MockPrismaClient() as unknown as PrismaClient;

// Add prisma to the global object in development to prevent multiple instances
if (!isProduction) {
  globalForPrisma.prisma = prisma;
}
