const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  try {
    const orders = await prisma.order.findMany({
      include: { items: true },
    });
    console.log(`PRISMA_POSTGRES_ORDERS_COUNT:${orders.length}`);
    console.log(JSON.stringify(orders, null, 2));
  } catch (err) {
    console.error("PRISMA_POSTGRES_ERROR:", err.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
