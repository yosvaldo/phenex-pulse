import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        factory: true,
        product: true,
      },
      orderBy: { createdAt: 'desc' }
    });
    
    const factories = await prisma.factory.findMany();
    const products = await prisma.product.findMany();

    return NextResponse.json({ orders, factories, products }, { status: 200 });
  } catch (error) {
    console.error("GET ORDERS ERROR:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { factoryId, productId, quantity, productionDays } = body;

    const totalLeadTime = Number(productionDays) + 7 + 42 + 9;
    const estimatedArrival = new Date();
    estimatedArrival.setDate(estimatedArrival.getDate() + totalLeadTime);

    const order = await prisma.order.create({
      data: {
        factoryId,
        productId,
        quantity: Number(quantity),
        productionDays: Number(productionDays),
        status: "PRODUCTION",
        estimatedArrival,
      }
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}