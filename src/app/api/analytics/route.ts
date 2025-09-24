import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  // Total messages
  const total = await prisma.messageLog.count();

  // Count by source
  const grouped = await prisma.messageLog.groupBy({
    by: ["source"],
    _count: { source: true },
  });

  // Top questions
  const topQuestions = await prisma.messageLog.groupBy({
    by: ["question"],
    _count: { question: true },
    orderBy: { _count: { question: "desc" } },
    take: 10,
  });

  return NextResponse.json({
    total,
    grouped,
    topQuestions,
  });
}
