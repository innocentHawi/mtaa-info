import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import OpenAI from "openai";

const prisma = new PrismaClient();
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL, // optional for OpenRouter
});

// GET all FAQs
export async function GET() {
  const faqs = await prisma.faq.findMany();
  return NextResponse.json(faqs);
}

// POST add a new FAQ
export async function POST(req: NextRequest) {
  const data = await req.json();

  // 1. Create FAQ without embedding
  const faq = await prisma.faq.create({ data: { question: data.question, answer: data.answer } });

  // 2. Generate embedding
  const embeddingRes = await client.embeddings.create({
    model: "text-embedding-3-small",
    input: data.question,
  });

  const embedding = embeddingRes.data[0].embedding;

  // 3. Store embedding in Neon (raw SQL, because Prisma doesn’t support vector yet)
  const embStr = "[" + embedding.join(",") + "]";
  await prisma.$executeRawUnsafe(
    `UPDATE "Faq" SET embedding = $1::vector WHERE id = $2`,
    embStr,
    faq.id
  );

  return NextResponse.json(faq);
}
