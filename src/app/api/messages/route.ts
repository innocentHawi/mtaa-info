import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.formData();

  // WhatsApp message data from Twilio
  const from = body.get("From");   
  const msg = body.get("Body");   

  console.log("📩 Incoming:", from, msg);

  // Simple reply
  const reply = `Hello 👋, you said: "${msg}"`;

  // TwiML (Twilio Markup Language) response
  return new NextResponse(
    `<Response><Message>${reply}</Message></Response>`,
    { headers: { "Content-Type": "text/xml" } }
  );
}
