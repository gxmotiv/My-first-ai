/**
 * My First AI — Cloudflare Workers AI backend
 * No API token is placed in this file.
 * Create a Worker, add a Workers AI binding named "AI", then paste/deploy.
 * CORS is not authentication; keep this endpoint for personal testing.
 */
const ALLOWED_ORIGIN = "https://gxmotiv.github.io";
const MODEL = "@cf/meta/llama-3.2-3b-instruct";
const MAX_MESSAGE_CHARS = 3000;
const MAX_OUTPUT_TOKENS = 400;

function json(data, status, origin) {
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin"
  };
  if (origin === ALLOWED_ORIGIN) headers["Access-Control-Allow-Origin"] = ALLOWED_ORIGIN;
  return new Response(JSON.stringify(data), { status, headers });
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin");
    if (origin !== ALLOWED_ORIGIN) return json({ error: "Origin not allowed." }, 403, null);

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Max-Age": "86400",
          "Vary": "Origin"
        }
      });
    }
    if (request.method !== "POST") return json({ error: "Use POST to send a message." }, 405, origin);

    const contentType = request.headers.get("Content-Type") || "";
    if (!contentType.toLowerCase().includes("application/json")) {
      return json({ error: "Content-Type must be application/json." }, 415, origin);
    }
    const length = Number(request.headers.get("Content-Length") || 0);
    if (length > 12000) return json({ error: "Request too large. Shorten your message." }, 413, origin);

    let body;
    try { body = await request.json(); }
    catch { return json({ error: "Request body must be valid JSON." }, 400, origin); }

    const message = typeof body?.message === "string" ? body.message.trim() : "";
    if (!message) return json({ error: "Please enter a message." }, 400, origin);
    if (message.length > MAX_MESSAGE_CHARS) {
      return json({ error: "Message is too long. Maximum " + MAX_MESSAGE_CHARS + " characters." }, 413, origin);
    }
    if (!env.AI || typeof env.AI.run !== "function") {
      return json({ error: "Workers AI binding is missing. Add a binding named AI, then redeploy." }, 500, origin);
    }

    try {
      const result = await env.AI.run(MODEL, {
        messages: [
          {
            role: "system",
            content: "You are My First AI, a helpful and honest assistant. Reply in the language the user uses. Do not claim to have searched the live web or verified facts unless that capability is actually available."
          },
          { role: "user", content: message }
        ],
        max_tokens: MAX_OUTPUT_TOKENS,
        temperature: 0.6
      });
      const answer = typeof result?.response === "string" ? result.response : "";
      if (!answer) return json({ error: "The model returned no text. Try again or check the model status." }, 502, origin);
      return json({ answer, model: MODEL, usage: result?.usage || null }, 200, origin);
    } catch {
      return json({
        error: "The AI request failed. Check Workers AI availability, model access, and your free-tier usage."
      }, 502, origin);
    }
  }
};
