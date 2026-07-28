// Vercel serverless function for Klar Coach.
// Keep GROQ_API_KEY server-side. Never send it to the browser.

const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";

module.exports = async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Method not allowed" });
  }

  if (!process.env.GROQ_API_KEY) {
    return response.status(503).json({
      error:
        "Klar Coach is not configured yet. Add GROQ_API_KEY to server environment variables.",
    });
  }

  const { messages } = request.body || {};
  if (!Array.isArray(messages) || messages.length === 0) {
    return response.status(400).json({ error: "A conversation is required." });
  }

  // Keep requests bounded so a chat drawer cannot accidentally become expensive.
  const safeMessages = messages
    .filter((message) =>
      ["system", "user", "assistant"].includes(message?.role),
    )
    .slice(-16)
    .map((message) => ({
      role: message.role,
      content: String(message.content || "").slice(0, 1500),
    }));

  try {
    const groqResponse = await fetch(GROQ_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || "llama-3.1-8b-instant",
        messages: safeMessages,
        temperature: 0.55,
        max_tokens: 180,
      }),
    });

    const payload = await groqResponse.json();
    if (!groqResponse.ok) {
      console.error("Groq error:", payload);
      return response.status(groqResponse.status).json({
        error:
          payload?.error?.message || "The coach could not reply right now.",
      });
    }

    return response.status(200).json({
      message: {
        role: "assistant",
        content:
          payload.choices?.[0]?.message?.content ||
          "I could not form a reply. Please try again.",
      },
    });
  } catch (error) {
    console.error("Klar Coach error:", error);
    return response.status(500).json({ error: "The coach connection failed." });
  }
};
