import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request, context: any) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    
    const updateData: any = {};
    
    if (body.status) {
      updateData.status = body.status;
      updateData.paidAt = body.status === "PAID" ? new Date() : null;
    }
    if (body.distributorId) updateData.distributorId = body.distributorId;
    if (body.dueDate) updateData.dueDate = new Date(body.dueDate);
    
    if (body.items && body.items.length > 0) {
      const totalAmount = body.items.reduce((sum: number, item: any) => sum + (item.quantity * item.price), 0);
      updateData.totalAmount = totalAmount;
      updateData.items = {
        deleteMany: {},
        create: body.items.map((item: any) => ({
          productId: item.productId,
          quantity: Number(item.quantity),
          price: Number(item.price),
        }))
      };
    }

    const invoice = await prisma.invoice.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(invoice, { status: 200 });
  } catch (error) {
    console.error("UPDATE INVOICE ERROR:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: any) {
  try {
    const { id } = await context.params;
    await prisma.invoice.delete({ where: { id } });
    return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("DELETE INVOICE ERROR:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}