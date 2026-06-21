import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Query is required." }, { status: 400 });
    }

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

    // If there's no key, return a harmless mock reply so the frontend works in dev.
    if (!OPENAI_API_KEY) {
      const fallback = `Mock assistant reply: I can't access OpenAI, but here's a sample answer for: ${query}`;
      return NextResponse.json({ data: { reply: fallback } });
    }

    const openAiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are OrgNest's AI assistant. Answer questions about service workflows, teams, project onboarding, and the OrgNest platform clearly and concisely.",
          },
          {
            role: "user",
            content: query,
          },
        ],
        temperature: 0.7,
        max_tokens: 400,
      }),
    });

    if (!openAiResponse.ok) {
      const text = await openAiResponse.text();
      // Log the remote error then return a friendly fallback to the frontend.
      // eslint-disable-next-line no-console
      console.error("OpenAI error:", openAiResponse.status, text);

      const fallback = `Sorry, the AI assistant is temporarily unavailable (status ${openAiResponse.status}).`;
      return NextResponse.json({ data: { reply: fallback } });
    }

    const result = await openAiResponse.json();
    const answer = result?.choices?.[0]?.message?.content ?? result?.choices?.[0]?.text ?? "I couldn't find an answer.";

    return NextResponse.json({ data: { reply: answer } });
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.error("AI assistant API error", error);
    return NextResponse.json({ data: { reply: "Sorry, the AI assistant is temporarily unavailable." } });
  }
}
