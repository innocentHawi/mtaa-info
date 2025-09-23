// lib/embeddings.ts
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL // optional for OpenRouter
});

/**
 * getEmbedding(text): returns number[] embedding
 */
export async function getEmbedding(text: string) {
  const res = await client.embeddings.create({
    model: "text-embedding-3-small", // 1536 dims
    input: text,
  });
  return res.data[0].embedding as number[];
}
