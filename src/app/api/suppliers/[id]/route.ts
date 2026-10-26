import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request, context: any) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    
    const existingOrder = await prisma.order.findUnique({ where: { id } });
    if (!existingOrder) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    const updateData: any = {};
    if (body.quantity) updateData.quantity = Number(body.quantity);

    if (body.status) {
      updateData.status = body.status;
      
      if (body.status !== existingOrder.status) {
        const now = new Date();
        if (body.status === "TRANSIT") {
          const newEta = new Date(now);
          newEta.setDate(newEta.getDate() + 58);
          updateData.estimatedArrival = newEta;
        } else if (body.status === "TRANSPORT") {
          const newEta = new Date(now);
          newEta.setDate(newEta.getDate() + 51);
          updateData.estimatedArrival = newEta;
        }
      }

      if (body.status === "READY" && body.estimatedArrival) {
        updateData.estimatedArrival = new Date(body.estimatedArrival);
      }
    }

    const order = await prisma.order.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    console.error("UPDATE ORDER ERROR:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: any) {
  try {
    const { id } = await context.params;
    await prisma.order.delete({ where: { id } });
    return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("DELETE ORDER ERROR:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}