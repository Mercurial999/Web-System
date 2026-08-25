import { prisma } from "./database/prisma.js";

async function test() {
  try {
    await prisma.$connect();

    console.log("✅ Connected to PostgreSQL!");

    const roles = await prisma.role.findMany();

    console.log("Roles:", roles);

    await prisma.$disconnect();
  } catch (error) {
    console.error("❌ Database connection failed");
    console.error(error);
  }
}

test();