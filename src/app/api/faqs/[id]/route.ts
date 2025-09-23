import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }   
) {
  const data = await req.json();
  const { id } = await params;                      

  const updated = await prisma.faq.update({
    where: { id: Number(id) },
    data,
  });
  return NextResponse.json(updated);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }   
) {
  const { id } = await params;                      

  await prisma.faq.delete({
    where: { id: Number(id) },
  });
  return NextResponse.json({ success: true });
}
