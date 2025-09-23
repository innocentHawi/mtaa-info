import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import OpenAI from "openai";

const prisma = new PrismaClient();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,     // your OpenRouter key
  baseURL: process.env.OPENAI_BASE_URL,   // point to OpenRouter
});

export async function POST(req: NextRequest) {
  const body = await req.formData();
  const msg = (body.get("Body") as string)?.toLowerCase();

  // 1. Check FAQ database
  const faqs = await prisma.faq.findMany();
  const faq = faqs.find(f => msg.includes(f.question.toLowerCase()));

  let reply: string;

  if (faq) {
    reply = faq.answer;
  } else {
    try {
      // 2. Fallback → OpenRouter
      const gpt = await openai.chat.completions.create({
        model: "openai/gpt-4o-mini", // or try "anthropic/claude-3-haiku"
        messages: [
          { role: "system", content: "You are MtaaInfo, a helpful assistant for Kenyan county services." },
          { role: "user", content: msg }
        ],
        max_tokens: 150,
      });

      reply = gpt.choices?.[0]?.message?.content?.trim() 
        || "Sorry, I don’t know that one yet.";
    } catch (error: any) {
      console.error("OpenAI error:", error);
      // Always return a Twilio-friendly XML response even if AI fails
      reply = `I couldn’t reach the AI service. You said: "${msg}"`;
    }
  }

  return new NextResponse(
    `<Response><Message>${reply}</Message></Response>`,
    { headers: { "Content-Type": "text/xml" } }
  );
}
