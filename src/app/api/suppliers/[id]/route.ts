import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request, context: any) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    
    const updatedData: any = {};
    if (body.status) updatedData.status = body.status;
    if (body.quantity) updatedData.quantity = Number(body.quantity);

    const order = await prisma.order.update({
      where: { id },
      data: updatedData,
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
    
    await prisma.order.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("DELETE ORDER ERROR:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}