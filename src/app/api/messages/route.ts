import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import OpenAI from "openai";

const prisma = new PrismaClient();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,     // your OpenAI or OpenRouter key
  baseURL: process.env.OPENAI_BASE_URL,   // optional: for OpenRouter
});

export async function POST(req: NextRequest) {
  const body = await req.formData();
  const msg = (body.get("Body") as string) || "";

  let reply: string;

  // 1. Get embedding for user message
  const embRes = await openai.embeddings.create({
    model: "text-embedding-3-small", // 1536-dim
    input: msg,
  });
  const userEmbedding = embRes.data[0].embedding;
  const embStr = "[" + userEmbedding.join(",") + "]";

  // 2. Find nearest FAQ via pgvector similarity search
  const rows = await prisma.$queryRawUnsafe<any[]>(`
    SELECT id, question, answer, (embedding <-> $1::vector) AS distance
    FROM "Faq"
    WHERE embedding IS NOT NULL
    ORDER BY embedding <-> $1::vector
    LIMIT 1;
  `, embStr);

  if (rows.length && rows[0].distance <= 0.30) {
    // ✅ Found a close FAQ (threshold = 0.30, tweak as needed)
    reply = rows[0].answer;
  } else {
    // ❌ No close match → fallback to GPT
    const gpt = await openai.chat.completions.create({
      model: "openai/gpt-4o-mini", // or another model via OpenRouter
      messages: [
        { role: "system", content: "You are MtaaInfo, a helpful assistant for Kenyan county services." },
        { role: "user", content: msg }
      ],
      max_tokens: 150,
    });
    reply = gpt.choices[0].message.content || "Sorry, I don't know that one yet.";
  }

  // 3. Respond via Twilio (TwiML)
  return new NextResponse(
    `<Response><Message>${reply}</Message></Response>`,
    { headers: { "Content-Type": "text/xml" } }
  );
}
