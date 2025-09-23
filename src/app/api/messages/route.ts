import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import OpenAI from "openai";

const prisma = new PrismaClient();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const body = await req.formData();
  const msg = (body.get("Body") as string)?.toLowerCase();

  // 1. Check FAQ
  const faqs = await prisma.faq.findMany();
  const faq = faqs.find(f => msg.includes(f.question.toLowerCase()));

  let reply: string;

  if (faq) {
    reply = faq.answer;
  } else {
    // 2. Fallback to GPT
    const gpt = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are MtaaInfo, a helpful assistant for Kenyan county services." },
        { role: "user", content: msg }
      ],
      max_tokens: 150,
    });
    reply = gpt.choices[0].message.content || "Sorry, I don't know that one yet.";
  }

  return new NextResponse(
    `<Response><Message>${reply}</Message></Response>`,
    { headers: { "Content-Type": "text/xml" } }
  );
}
