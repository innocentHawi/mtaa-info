import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const data = await req.json();
  const updated = await prisma.faq.update({
    where: { id: Number(params.id) },
    data,
  });
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.faq.delete({
    where: { id: Number(params.id) },
  });
  return NextResponse.json({ success: true });
}
