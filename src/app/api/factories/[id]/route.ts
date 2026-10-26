import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request, context: any) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    
    const factory = await prisma.factory.update({
      where: { id },
      data: {
        name: body.name,
        location: body.location,
        logoUrl: body.logoUrl,
      },
    });

    return NextResponse.json(factory, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: any) {
  try {
    const { id } = await context.params;
    await prisma.factory.delete({ where: { id } });
    return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Cannot delete factory. It is likely linked to existing orders." }, { status: 400 });
  }
}