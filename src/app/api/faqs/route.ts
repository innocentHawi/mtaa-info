import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET all FAQs
export async function GET() {
  const faqs = await prisma.faq.findMany();
  return NextResponse.json(faqs);
}

// POST add a new FAQ
export async function POST(req: NextRequest) {
  const data = await req.json();
  const faq = await prisma.faq.create({ data });
  return NextResponse.json(faq);
}
