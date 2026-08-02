import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const defaultProducts = [
  {
    id: "vodafone-uk-official",
    name: "Official Vodafone UK Pay-As-You-Go SIM Card",
    category: "Vodafone UK",
    price: 3500,
    originalPrice: 6000,
    rating: 5.0,
    reviewsCount: 312,
    image: "/product pictures/Vodafone_img1_202304.jpg",
    description: "Factory sealed physical Vodafone UK SIM. Zero monthly contract. Guaranteed UK OTPs, Wise, Monzo, and PayPal UK accounts.",
    isBestSeller: true,
  },
  {
    id: "tmobile-usa-official",
    name: "Official T-Mobile USA Pay-As-You-Go SIM Card",
    category: "T-Mobile USA",
    price: 10500,
    originalPrice: 16000,
    rating: 4.9,
    reviewsCount: 189,
    image: "/t mobile/images (1).jpg",
    description: "Genuine T-Mobile USA SIM with full US number (+1). Roaming in 210+ countries. Ideal for PayPal US & US TikTok Live.",
    isBestSeller: true,
  },
  {
    id: "giffgaff-uk-sim",
    name: "Giffgaff UK SIM Card in Pakistan",
    category: "Giffgaff UK",
    price: 2000,
    originalPrice: 3500,
    rating: 4.8,
    reviewsCount: 95,
    image: "/product pictures/vodafone-sim.png",
    description: "Official Giffgaff UK SIM Card delivered across Pakistan. Ideal for TikTok Live, UK banking OTPs, and PayPal verification.",
    isBestSeller: true,
  },
  {
    id: "ee-uk-sim",
    name: "EE UK Pay-As-You-Go SIM Card in Pakistan",
    category: "EE UK",
    price: 4000,
    originalPrice: 7000,
    rating: 4.9,
    reviewsCount: 127,
    image: "/ee/ee-sim-card.svg",
    description: "Official EE UK SIM on the UK's fastest 5G-ready network. Perfect for UK banking OTPs, TikTok Live, PayPal verification, and international roaming without contracts.",
    isBestSeller: false,
  },
  {
    id: "lebara-uk-sim",
    name: "Lebara UK Pay-As-You-Go SIM Card in Pakistan",
    category: "Lebara UK",
    price: 2500,
    originalPrice: 4500,
    rating: 4.7,
    reviewsCount: 88,
    image: "/lebara/lebara-sim-card.svg",
    description: "Official Lebara UK SIM with affordable international calling rates. Ideal for UK banking OTPs, PayPal, Wise, and TikTok Live in Pakistan.",
    isBestSeller: false,
  },
];

const defaultOrders = [
  {
    orderNumber: "VOD-849201",
    customerName: "Muhammad Ali Khan",
    phone: "03001234567",
    email: "ali.khan@gmail.com",
    city: "Karachi",
    address: "House 45, Street 12, Block 5, Clifton",
    landmark: "Near Bilawal House",
    totalAmount: 3500,
    paymentMethod: "Cash on Delivery",
    status: "Pending",
    items: {
      create: [
        {
          name: "Official Vodafone UK Pay-As-You-Go SIM Card",
          qty: 1,
          price: 3500,
          image: "/product pictures/Vodafone_img1_202304.jpg",
          carrier: "Vodafone UK",
        },
      ],
    },
  },
  {
    orderNumber: "VOD-739102",
    customerName: "Hamza Ahmed",
    phone: "03218765432",
    email: "hamza@agency.pk",
    city: "Lahore",
    address: "Flat 302, Al-Hafeez Heights, Gulberg III",
    landmark: "Near Pace Shopping Mall",
    totalAmount: 10500,
    paymentMethod: "Cash on Delivery",
    status: "Dispatched",
    items: {
      create: [
        {
          name: "Official T-Mobile USA Pay-As-You-Go SIM Card",
          qty: 1,
          price: 10500,
          image: "/t mobile/images (1).jpg",
          carrier: "T-Mobile USA",
        },
      ],
    },
  },
];

async function main() {
  console.log("Seeding local database (dev.db)...");

  for (const prod of defaultProducts) {
    await prisma.product.upsert({
      where: { id: prod.id },
      update: prod,
      create: prod,
    });
  }

  for (const ord of defaultOrders) {
    const existing = await prisma.order.findUnique({
      where: { orderNumber: ord.orderNumber },
    });
    if (!existing) {
      await prisma.order.create({
        data: ord,
      });
    }
  }

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
