import fs from "fs";
import path from "path";
import { prisma } from "./prisma";

export interface OrderItem {
  id: string;
  name: string;
  qty: number;
  price: number;
  image: string;
  carrier: string;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  email?: string;
  city: string;
  address: string;
  landmark?: string;
  notes?: string;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: "Cash on Delivery";
  status: "Pending" | "Confirmed" | "Dispatched" | "Delivered" | "Cancelled";
  createdAt: string;
}

const ORDERS_FILE_PATH = path.join(process.cwd(), "data", "orders.json");

// Default initial orders
const defaultOrders: Order[] = [
  {
    id: "VOD-849201",
    customerName: "Muhammad Ali Khan",
    phone: "03001234567",
    email: "ali.khan@gmail.com",
    city: "Karachi",
    address: "House 45, Street 12, Block 5, Clifton",
    landmark: "Near Bilawal House",
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
  },
  {
    id: "VOD-739102",
    customerName: "Hamza Ahmed",
    phone: "03218765432",
    email: "hamza@agency.pk",
    city: "Lahore",
    address: "Flat 302, Al-Hafeez Heights, Gulberg III",
    landmark: "Near Pace Shopping Mall",
    items: [
      {
        id: "tmobile-usa-official",
        name: "Official T-Mobile USA Pay-As-You-Go SIM Card",
        qty: 1,
        price: 10500,
        image: "/t mobile/images (1).jpg",
        carrier: "T-Mobile USA",
      },
    ],
    totalAmount: 10500,
    paymentMethod: "Cash on Delivery",
    status: "Dispatched",
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
];

function ensureOrdersFileExists() {
  try {
    const dir = path.dirname(ORDERS_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(ORDERS_FILE_PATH)) {
      fs.writeFileSync(ORDERS_FILE_PATH, JSON.stringify(defaultOrders, null, 2), "utf-8");
    }
  } catch (err) {
    console.error("Failed to initialize orders.json file:", err);
  }
}

export function getStoredOrders(): Order[] {
  ensureOrdersFileExists();
  try {
    const fileData = fs.readFileSync(ORDERS_FILE_PATH, "utf-8");
    return JSON.parse(fileData);
  } catch (err) {
    console.error("Error reading orders file:", err);
    return defaultOrders;
  }
}

function saveOrdersToFile(orders: Order[]) {
  ensureOrdersFileExists();
  try {
    fs.writeFileSync(ORDERS_FILE_PATH, JSON.stringify(orders, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing to orders file:", err);
  }
}

export function addOrder(order: Order): Order {
  const orders = getStoredOrders();
  const updatedOrders = [order, ...orders];
  saveOrdersToFile(updatedOrders);

  // Async sync to PostgreSQL database
  prisma.order
    .create({
      data: {
        orderNumber: order.id,
        customerName: order.customerName,
        phone: order.phone,
        email: order.email || null,
        city: order.city,
        address: order.address,
        landmark: order.landmark || null,
        notes: order.notes || null,
        totalAmount: order.totalAmount,
        paymentMethod: order.paymentMethod,
        status: order.status,
        items: {
          create: (order.items || []).map((item) => ({
            name: item.name,
            qty: item.qty,
            price: item.price,
            image: item.image,
            carrier: item.carrier,
          })),
        },
      },
    })
    .catch((pgErr) => console.error("[PostgreSQL Save Order Error]:", pgErr));

  return order;
}

export function updateOrderStatus(
  id: string,
  status: Order["status"]
): Order | null {
  const orders = getStoredOrders();
  const index = orders.findIndex((o) => o.id === id);
  if (index !== -1) {
    orders[index] = { ...orders[index], status };
    saveOrdersToFile(orders);

    // Sync status update to PostgreSQL database
    prisma.order
      .updateMany({
        where: { orderNumber: id },
        data: { status },
      })
      .catch((pgErr) => console.error("[PostgreSQL Update Status Error]:", pgErr));

    return orders[index];
  }
  return null;
}

export function deleteOrder(id: string): boolean {
  const orders = getStoredOrders();
  const initialLen = orders.length;
  const filtered = orders.filter((o) => o.id !== id);
  if (filtered.length < initialLen) {
    saveOrdersToFile(filtered);

    // Sync delete to PostgreSQL database
    prisma.order
      .deleteMany({
        where: { orderNumber: id },
      })
      .catch((pgErr) => console.error("[PostgreSQL Delete Order Error]:", pgErr));

    return true;
  }
  return false;
}

// Async PostgreSQL fetching helper
export async function getStoredOrdersAsync(): Promise<Order[]> {
  try {
    const dbOrders = await prisma.order.findMany({
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });

    if (dbOrders && dbOrders.length > 0) {
      return dbOrders.map((o) => ({
        id: o.orderNumber,
        customerName: o.customerName,
        phone: o.phone,
        email: o.email || "",
        city: o.city,
        address: o.address,
        landmark: o.landmark || "",
        notes: o.notes || "",
        totalAmount: o.totalAmount,
        paymentMethod: o.paymentMethod as "Cash on Delivery",
        status: o.status as Order["status"],
        createdAt: o.createdAt.toISOString(),
        items: o.items.map((i) => ({
          id: i.id,
          name: i.name,
          qty: i.qty,
          price: i.price,
          image: i.image,
          carrier: i.carrier,
        })),
      }));
    }
  } catch (err) {
    console.error("[PostgreSQL Fetch Orders Error]:", err);
  }
  return getStoredOrders();
}
