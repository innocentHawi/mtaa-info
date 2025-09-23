import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import OpenAI from "openai";
import stringSimilarity from "string-similarity";

const prisma = new PrismaClient();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
});

export async function POST(req: NextRequest) {
  const body = await req.formData();
  const msg = (body.get("Body") as string)?.toLowerCase();

  // 1. Check FAQ database with fuzzy match
  const faqs = await prisma.faq.findMany();
  const faqQuestions = faqs.map(f => f.question.toLowerCase());

  const { bestMatch, bestMatchIndex } = stringSimilarity.findBestMatch(msg, faqQuestions);

  let reply: string;

  if (bestMatch.rating > 0.5) { // you can tune threshold (0 to 1)
    reply = faqs[bestMatchIndex].answer;
  } else {
    // 2. Fallback → OpenRouter
    try {
      const gpt = await openai.chat.completions.create({
        model: "openai/gpt-4o-mini",
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
      reply = `I couldn’t reach the AI service. You said: "${msg}"`;
    }
  }

  return new NextResponse(
    `<Response><Message>${reply}</Message></Response>`,
    { headers: { "Content-Type": "text/xml" } }
  );
}
