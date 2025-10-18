import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req) {
  if (!process.env.GROQ_API_KEY) {
    return new Response(JSON.stringify({ error: "API key missing" }), { status: 500 });
  }

  try {
    const { prompt } = await req.json();

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "openai/gpt-oss-20b",
    });

    return new Response(
      JSON.stringify({
        message: chatCompletion.choices[0]?.message?.content || "",
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Groq API error:", err);
    return new Response(JSON.stringify({ error: "Failed to fetch from Groq" }), { status: 500 });
  }
}
