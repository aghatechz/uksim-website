import { NextResponse } from "next/server";
import { updateProduct, deleteProduct } from "../../../../lib/productsStore";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updated = await updateProduct(id, body);
    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Product not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, product: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to update product." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = await deleteProduct(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Product not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Product deleted successfully." });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to delete product." },
      { status: 500 }
    );
  }
}
