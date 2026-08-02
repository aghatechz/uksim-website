import { NextResponse } from "next/server";
import { getStoredProductsAsync, addProduct } from "../../../lib/productsStore";

export async function GET() {
  const products = await getStoredProductsAsync();
  return NextResponse.json({ success: true, products });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, category, price, originalPrice, rating, reviewsCount, image, description, isBestSeller } = body;

    if (!name || !price) {
      return NextResponse.json(
        { success: false, message: "Product Name and Price are required." },
        { status: 400 }
      );
    }

    const createdProduct = addProduct({
      name,
      category: category || "Vodafone UK",
      price: Number(price),
      originalPrice: Number(originalPrice || price * 1.5),
      rating: Number(rating || 5.0),
      reviewsCount: Number(reviewsCount || 10),
      image: image || "/product pictures/Vodafone_img1_202304.jpg",
      description: description || "Official SIM Card Package",
      isBestSeller: Boolean(isBestSeller),
    });

    return NextResponse.json({ success: true, product: createdProduct });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to create product." },
      { status: 500 }
    );
  }
}
