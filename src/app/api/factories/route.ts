import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const factories = await prisma.factory.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(factories, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const factory = await prisma.factory.create({
      data: {
        name: body.name,
        location: body.location,
        logoUrl: body.logoUrl,
      }
    });
    return NextResponse.json(factory, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}