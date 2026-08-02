const { addOrder } = require("./lib/ordersStore");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function testKhanOrder() {
  const orderId = `VOD-${Math.floor(100000 + Math.random() * 900000)}`;

  console.log("Adding test order for Khan Sab...");

  addOrder({
    id: orderId,
    customerName: "Khan Sab",
    phone: "03009998877",
    email: "khansab@gmail.com",
    city: "Peshawar",
    address: "House 12, Main Saddar Road",
    items: [
      {
        id: "vodafone-uk-official",
        name: "Official Vodafone UK Pay-As-You-Go SIM Card",
        qty: 1,
        price: 3500,
        image: "/product pictures/Vodafone_img1_202304.jpg",
        carrier: "Vodafone UK",
      },
    ],
    totalAmount: 3500,
    paymentMethod: "Cash on Delivery",
    status: "Pending",
    createdAt: new Date().toISOString(),
  });

  // Wait 1 second for async PostgreSQL insert
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Query PostgreSQL directly via Prisma
  const pgOrder = await prisma.order.findFirst({
    where: { customerName: "Khan Sab" },
    include: { items: true },
  });

  if (pgOrder) {
    console.log("✅ SUCCESS! Khan Sab order FOUND in PostgreSQL database:");
    console.log(JSON.stringify(pgOrder, null, 2));
  } else {
    console.log("❌ FAILED to find Khan Sab order in PostgreSQL database");
  }

  await prisma.$disconnect();
}

testKhanOrder();
