import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import OpenAI from "openai";

const prisma = new PrismaClient();
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL, // optional for OpenRouter
});

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const msg = String(form.get("Body") || "").trim();

  // 1) Generate embedding for user query
  const embRes = await client.embeddings.create({
    model: "text-embedding-3-small",
    input: msg,
  });
  const emb = embRes.data[0].embedding;
  const embStr = "[" + emb.join(",") + "]";

  // 2) Search FAQs by vector similarity
  const result = await prisma.$queryRawUnsafe<any[]>(`
    SELECT id, question, answer, (embedding <-> ${embStr}::vector) AS distance
    FROM "Faq"
    WHERE embedding IS NOT NULL
    ORDER BY embedding <-> ${embStr}::vector
    LIMIT 1;
  `);

  let reply: string | null = null;
  if (result.length > 0) {
    const { answer, distance } = result[0];
    const DIST_THRESHOLD = 0.30; // tweak this based on testing
    if (distance <= DIST_THRESHOLD) {
      reply = answer;
    }
  }

  // 3) Fallback to GPT if no good FAQ
  if (!reply) {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are MtaaInfo, a helpful assistant for Kenyan local information and services.",
        },
        { role: "user", content: msg },
      ],
      max_tokens: 250,
    });
    reply = completion.choices[0].message?.content || "Samahani, sina jibu kwa sasa.";
  }

  // 4) Return TwiML to Twilio
  return new NextResponse(`<Response><Message>${reply}</Message></Response>`, {
    headers: { "Content-Type": "text/xml" },
  });
}
