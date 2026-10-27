import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [products, orders, invoices, distributors] = await Promise.all([
      prisma.product.findMany(),
      prisma.order.findMany({ include: { factory: true, product: true } }),
      prisma.invoice.findMany({ include: { distributor: true } }),
      prisma.distributor.count()
    ]);

    const lowStockCount = products.filter(
      (p: any) => (p.reorderRule === "THRESHOLD" || !p.reorderRule) && p.currentStock <= p.reorderPoint
    ).length;

    const activeOrders = orders.filter((o: any) => o.status !== "READY").length;

    const totalRevenue = invoices.filter((i: any) => i.status === "PAID").reduce((sum: any, i: any) => sum + i.totalAmount, 0);
    const outstandingRevenue = invoices.filter((i: any) => i.status !== "PAID").reduce((sum: any, i: any) => sum + i.totalAmount, 0);

    const overdueInvoices = invoices
      .filter((i: any) => (i.status === "OVERDUE" || (i.status === "OUTSTANDING" && new Date(i.dueDate) < new Date())))
      .map((i: any) => ({
        distributor: i.distributor.name,
        amount: i.totalAmount,
        dueDate: i.dueDate
      }));

    return NextResponse.json({
      inventory: { total: products.length, lowStock: lowStockCount, activeOrders },
      financials: { totalRevenue, outstandingRevenue, overdueInvoices, totalDistributors: distributors }
    }, { status: 200 });
  } catch (error) {
    console.error("REPORTS ERROR:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}