import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const invoices = await prisma.invoice.findMany({
      include: { 
        distributor: true, 
        items: { include: { product: true } } 
      },
      orderBy: { createdAt: 'desc' }
    });
    
    const distributors = await prisma.distributor.findMany();
    const products = await prisma.product.findMany();

    return NextResponse.json({ invoices, distributors, products }, { status: 200 });
  } catch (error) {
    console.error("GET INVOICES ERROR:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const totalAmount = body.items.reduce((sum: number, item: any) => sum + (item.quantity * item.price), 0);

    const invoice = await prisma.invoice.create({
      data: {
        distributorId: body.distributorId,
        dueDate: new Date(body.dueDate),
        totalAmount,
        status: "OUTSTANDING",
        items: {
          create: body.items.map((item: any) => ({
            productId: item.productId,
            quantity: Number(item.quantity),
            price: Number(item.price),
          }))
        }
      }
    });

    return NextResponse.json(invoice, { status: 201 });
  } catch (error) {
    console.error("CREATE INVOICE ERROR:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}