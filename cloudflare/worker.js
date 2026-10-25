/**
 * My First AI — Cloudflare Workers AI backend.
 *
 * Required Cloudflare binding: AI (Workers AI).
 * Optional binding: ASSETS (keeps a Worker-hosted frontend working at GET /).
 * No API token is stored in this file or in the public frontend.
 *
 * GitHub Pages frontend: https://gxmotiv.github.io
 * CORS is not authentication; monitor usage and keep within the free-tier quota.
 */
const ALLOWED_ORIGINS = new Set([
  "https://gxmotiv.github.io",
  "https://1.gagandeep-hwr.workers.dev"
]);
const MODEL = "@cf/meta/llama-3.1-8b-instruct-fp8";
const MAX_MESSAGE_CHARS = 3500;
const MAX_BODY_BYTES = 16000;
const MAX_OUTPUT_TOKENS = 400;

function makeHeaders(origin) {
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin"
  };
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }
  return headers;
}

function json(data, status, origin) {
  return new Response(JSON.stringify(data), {
    status,
    headers: makeHeaders(origin)
  });
}

function cleanMessages(body) {
  const allowedRoles = new Set(["system", "user", "assistant"]);
  let messages = [];
  if (Array.isArray(body?.messages)) {
    messages = body.messages
      .filter((m) => m && allowedRoles.has(m.role) && typeof m.content === "string")
      .slice(-12)
      .map((m) => ({ role: m.role, content: m.content.trim() }));
  } else if (typeof body?.message === "string") {
    messages = [{ role: "user", content: body.message.trim() }];
  }

  const totalChars = messages.reduce((sum, m) => sum + m.content.length, 0);
  if (totalChars > MAX_MESSAGE_CHARS) {
    return { error: "Conversation is too long. Keep the total message text under " + MAX_MESSAGE_CHARS + " characters." };
  }
  if (!messages.some((m) => m.role === "user" && m.content)) {
    return { error: "Please send a non-empty user message." };
  }
  if (!messages.some((m) => m.role === "system")) {
    messages.unshift({
      role: "system",
      content: "You are My First AI, a helpful and honest assistant. Reply in the language the user uses. Do not claim to have searched the live web or verified facts unless that capability is actually available."
    });
  }
  return { messages };
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin") || "";

    // Reject browser origins not explicitly approved above.
    if (origin && !ALLOWED_ORIGINS.has(origin)) {
      return json({ error: "This website origin is not allowed." }, 403, "");
    }

    // Browsers send this preflight before cross-origin JSON POST requests.
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: makeHeaders(origin)
      });
    }

    // Preserve a Worker-hosted static UI if the ASSETS binding is configured.
    if (url.pathname === "/" && request.method === "GET" && env.ASSETS?.fetch) {
      return env.ASSETS.fetch(request);
    }

    if (url.pathname === "/api/health" && request.method === "GET") {
      return json({ ok: true, endpoint: "/api/chat", model: MODEL }, 200, origin);
    }

    // /api/chat is the documented template route; POST / remains backward-compatible.
    if (url.pathname !== "/api/chat" && url.pathname !== "/") {
      return json({ error: "Route not found. Use POST /api/chat." }, 404, origin);
    }
    if (request.method !== "POST") {
      return json({ error: "Use POST /api/chat to send a message." }, 405, origin);
    }

    const contentType = request.headers.get("Content-Type") || "";
    if (!contentType.toLowerCase().includes("application/json")) {
      return json({ error: "Content-Type must be application/json." }, 415, origin);
    }

    const length = Number(request.headers.get("Content-Length") || 0);
    if (length > MAX_BODY_BYTES) {
      return json({ error: "Request is too large. Shorten the conversation." }, 413, origin);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: "Request body must be valid JSON." }, 400, origin);
    }

    const parsed = cleanMessages(body);
    if (parsed.error) {
      const tooLong = parsed.error.includes("too long");
      return json({ error: parsed.error }, tooLong ? 413 : 400, origin);
    }
    if (!env.AI || typeof env.AI.run !== "function") {
      return json({ error: "Workers AI binding is missing. Add a binding named AI, then redeploy." }, 500, origin);
    }

    try {
      const result = await env.AI.run(MODEL, {
        messages: parsed.messages,
        max_tokens: MAX_OUTPUT_TOKENS,
        temperature: 0.6,
        stream: false
      });
      const answer = typeof result?.response === "string" ? result.response.trim() : "";
      if (!answer) {
        return json({ error: "The model returned no text. Check model availability and free-tier usage." }, 502, origin);
      }
      return json({ answer, model: MODEL, usage: result?.usage || null }, 200, origin);
    } catch (error) {
      // Do not leak internal details or account information to the public client.
      return json({
        error: "AI inference failed. Check the Workers AI model, AI binding, and available free-tier quota."
      }, 502, origin);
    }
  }
};
