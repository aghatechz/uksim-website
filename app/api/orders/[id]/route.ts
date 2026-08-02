import { NextResponse } from "next/server";
import { updateOrderStatus, deleteOrder } from "../../../../lib/ordersStore";

// PATCH /api/orders/[id] - Update order status (Pending -> Dispatched -> Delivered)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { status } = await request.json();

    if (!status) {
      return NextResponse.json(
        { success: false, message: "Status is required" },
        { status: 400 }
      );
    }

    const updated = updateOrderStatus(resolvedParams.id, status);

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, order: updated }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to update order" },
      { status: 500 }
    );
  }
}

// DELETE /api/orders/[id] - Remove an order
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const success = deleteOrder(resolvedParams.id);

    if (!success) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Order deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to delete order" },
      { status: 500 }
    );
  }
}
