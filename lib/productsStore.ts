import fs from "fs";
import path from "path";
import { prisma } from "./prisma";

export interface ProductItem {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  image: string;
  description: string;
  isBestSeller?: boolean;
}

const DATA_FILE_PATH = path.join(process.cwd(), "data", "products.json");

const defaultProducts: ProductItem[] = [
  {
    id: "vodafone-uk-official",
    name: "Official Vodafone UK Pay-As-You-Go SIM Card",
    category: "Vodafone UK",
    price: 3500,
    originalPrice: 6000,
    rating: 5.0,
    reviewsCount: 312,
    image: "/vodafone/WhatsApp Image 2026-08-04 at 3.18.06 AM.jpeg",
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
    image: "/t-mobile/WhatsApp Image 2026-08-04 at 3.28.45 AM.jpeg",
    description: "Genuine T-Mobile USA SIM with full US number (+1). Roaming in 210+ countries. Ideal for PayPal US & US TikTok Live.",
    isBestSeller: true,
  },
  {
    id: "usa-tiktok-rpm-sim",
    name: "USA SIM Card for Only TikTok Audience Target & Increase RPM",
    category: "T-Mobile USA",
    price: 2000,
    originalPrice: 4500,
    rating: 4.9,
    reviewsCount: 214,
    image: "/t-mobile/WhatsApp Image 2026-08-04 at 3.28.44 AM.jpeg",
    description: "Dedicated USA SIM Card designed exclusively for Pakistani TikTokers to unlock USA-only audience targeting, maximize your RPM earnings, and go LIVE on TikTok with a genuine US number (+1). No VPN needed — just insert and start earning higher CPM from US viewers.",
    isBestSeller: true,
  },
];

function ensureFileExists() {
  try {
    const dir = path.dirname(DATA_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE_PATH)) {
      fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(defaultProducts, null, 2), "utf-8");
    }
  } catch (err) {
    console.error("Failed to initialize products.json file:", err);
  }
}

export function getStoredProducts(): ProductItem[] {
  ensureFileExists();
  try {
    const fileData = fs.readFileSync(DATA_FILE_PATH, "utf-8");
    return JSON.parse(fileData);
  } catch (err) {
    return defaultProducts;
  }
}

function saveProductsToFile(products: ProductItem[]) {
  ensureFileExists();
  try {
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(products, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing to products file:", err);
  }
}

export function addProduct(newProductData: Omit<ProductItem, "id">): ProductItem {
  const products = getStoredProducts();
  const newId = `product-${Date.now()}`;
  const newProduct: ProductItem = {
    id: newId,
    ...newProductData,
  };
  const updatedList = [newProduct, ...products];
  saveProductsToFile(updatedList);

  // Sync to PostgreSQL database
  prisma.product
    .create({
      data: {
        id: newProduct.id,
        name: newProduct.name,
        category: newProduct.category,
        price: newProduct.price,
        originalPrice: newProduct.originalPrice,
        rating: newProduct.rating || 5.0,
        reviewsCount: newProduct.reviewsCount || 0,
        image: newProduct.image,
        description: newProduct.description,
        isBestSeller: newProduct.isBestSeller || false,
      },
    })
    .catch((pgErr) => console.error("[PostgreSQL Save Product Error]:", pgErr));

  return newProduct;
}

export async function updateProduct(id: string, updatedFields: Partial<ProductItem>): Promise<ProductItem | null> {
  const products = getStoredProducts();
  const index = products.findIndex((p) => p.id === id);
  let fileUpdated: ProductItem | null = null;

  if (index !== -1) {
    products[index] = {
      ...products[index],
      ...updatedFields,
    };
    saveProductsToFile(products);
    fileUpdated = products[index];
  }

  // Sync update to PostgreSQL database (always run — product may exist only in DB on Vercel)
  try {
    await prisma.product.updateMany({
      where: { id },
      data: {
        ...(updatedFields.name !== undefined && { name: updatedFields.name }),
        ...(updatedFields.category !== undefined && { category: updatedFields.category }),
        ...(updatedFields.price !== undefined && { price: updatedFields.price }),
        ...(updatedFields.originalPrice !== undefined && { originalPrice: updatedFields.originalPrice }),
        ...(updatedFields.rating !== undefined && { rating: updatedFields.rating }),
        ...(updatedFields.reviewsCount !== undefined && { reviewsCount: updatedFields.reviewsCount }),
        ...(updatedFields.image !== undefined && { image: updatedFields.image }),
        ...(updatedFields.description !== undefined && { description: updatedFields.description }),
        ...(updatedFields.isBestSeller !== undefined && { isBestSeller: updatedFields.isBestSeller }),
      },
    });

    // If not found in file, try to return the DB record so the API responds correctly
    if (!fileUpdated) {
      const dbProduct = await prisma.product.findUnique({ where: { id } });
      if (dbProduct) {
        fileUpdated = {
          id: dbProduct.id,
          name: dbProduct.name,
          category: dbProduct.category,
          price: dbProduct.price,
          originalPrice: dbProduct.originalPrice,
          rating: dbProduct.rating,
          reviewsCount: dbProduct.reviewsCount,
          image: dbProduct.image,
          description: dbProduct.description,
          isBestSeller: dbProduct.isBestSeller,
        };
      }
    }
  } catch (pgErr) {
    console.error("[PostgreSQL Update Product Error]:", pgErr);
  }

  return fileUpdated;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const products = getStoredProducts();
  const initialLength = products.length;
  const filtered = products.filter((p) => p.id !== id);
  const foundInFile = filtered.length < initialLength;

  if (foundInFile) {
    saveProductsToFile(filtered);
  }

  // Sync delete to PostgreSQL database (always run — product may exist only in DB on Vercel)
  try {
    const res = await prisma.product.deleteMany({ where: { id } });
    if (res.count > 0) return true;
  } catch (pgErr) {
    console.error("[PostgreSQL Delete Product Error]:", pgErr);
  }

  return foundInFile;
}

// Async PostgreSQL fetching helper (DB first, file fallback)
export async function getStoredProductsAsync(): Promise<ProductItem[]> {
  try {
    const dbProducts = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });

    if (dbProducts && dbProducts.length > 0) {
      return dbProducts.map((p) => ({
        id: p.id,
        name: p.name,
        category: p.category,
        price: p.price,
        originalPrice: p.originalPrice,
        rating: p.rating,
        reviewsCount: p.reviewsCount,
        image: p.image,
        description: p.description,
        isBestSeller: p.isBestSeller,
      }));
    }
  } catch (err) {
    console.error("[PostgreSQL Fetch Products Error]:", err);
  }
  return getStoredProducts();
}
