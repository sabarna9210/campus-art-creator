import { PrismaClient } from "@prisma/client";

declare global {
  // Allow global prisma to have the type PrismaClient or undefined
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV === "development") {
  global.prisma = prisma;
}

export default prisma;

