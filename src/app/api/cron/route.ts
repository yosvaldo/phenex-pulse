import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import EmailService from "@/services/email.service";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const allThresholdProducts = await prisma.product.findMany({
      where: { 
        OR: [
          { reorderRule: "THRESHOLD" },
          { reorderRule: null }
        ]
      }
    });
    
    const lowStockProducts = allThresholdProducts.filter(
      (p) => p.currentStock <= p.reorderPoint
    );

    if (lowStockProducts.length > 0) {
      await EmailService.sendReorderAlert(lowStockProducts);
    }

    const dueInvoices = await prisma.invoice.findMany({
      where: {
        status: { in: ["OUTSTANDING", "OVERDUE"] },
        dueDate: { lte: new Date() }
      },
      include: { distributor: true }
    });

    if (dueInvoices.length > 0) {
      const formattedInvoices = dueInvoices.map(inv => ({
        ...inv,
        formattedDate: new Date(inv.dueDate).toLocaleDateString(),
        totalAmount: inv.totalAmount.toLocaleString("id-ID")
      }));
      
      await EmailService.sendCollectionAlert(formattedInvoices);
      
      const ids = dueInvoices.map(inv => inv.id);
      await prisma.invoice.updateMany({
        where: { id: { in: ids }, status: "OUTSTANDING" },
        data: { status: "OVERDUE" }
      });
    }

    return NextResponse.json({ 
      message: "Cron executed successfully", 
      lowStock: lowStockProducts.length, 
      dueInvoices: dueInvoices.length 
    }, { status: 200 });
  } catch (error) {
    console.error("CRON ERROR:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}