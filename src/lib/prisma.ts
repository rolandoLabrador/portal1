// src/lib/prisma.ts

import { PrismaClient } from "@prisma/client";

// Add PrismaClient to the NodeJS global type to avoid multiple instances in development
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient({
  log: ['query'], // Optional: Enables query logging in development
});

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

export default prisma;
