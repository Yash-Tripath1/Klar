/*
  Local development server for Klar.
  - Serves the static frontend
  - Safely proxies Klar Coach requests to Groq
  - Reads GROQ_API_KEY from .env.local (never from browser code)

  Run: node server.js
  Open: http://localhost:3000
*/

const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const PORT = Number(process.env.PORT || 3000);
const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";

loadLocalEnvironment();

function loadLocalEnvironment() {
  const envPath = path.join(ROOT, ".env.local");
  if (!fs.existsSync(envPath)) return;

  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const separator = trimmed.indexOf("=");
    if (separator === -1) continue;
    const key = trimmed.slice(0, separator).trim();
    const value = trimmed
      .slice(separator + 1)
      .trim()
      .replace(/^['"]|['"]$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
}

function sendJson(response, status, body) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
  });
  response.end(JSON.stringify(body));
}

function contentType(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  return (
    {
      ".html": "text/html; charset=utf-8",
      ".js": "application/javascript; charset=utf-8",
      ".css": "text/css; charset=utf-8",
      ".json": "application/json; charset=utf-8",
      ".svg": "image/svg+xml",
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
    }[extension] || "application/octet-stream"
  );
}

function readRequestBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 100_000)
        reject(new Error("Request body is too large."));
    });
    request.on("end", () => resolve(body));
    request.on("error", reject);
  });
}

async function handleChat(request, response) {
  if (request.method !== "POST")
    return sendJson(response, 405, { error: "Method not allowed" });
  if (!process.env.GROQ_API_KEY) {
    return sendJson(response, 503, {
      error:
        "Missing GROQ_API_KEY. Add it to .env.local, then restart node server.js.",
    });
  }

  try {
    const payload = JSON.parse(await readRequestBody(request));
    if (!Array.isArray(payload.messages))
      return sendJson(response, 400, { error: "Messages are required." });

    const messages = payload.messages
      .filter((message) =>
        ["system", "user", "assistant"].includes(message?.role),
      )
      .slice(-16)
      .map((message) => ({
        role: message.role,
        content: String(message.content || "").slice(0, 1500),
      }));

    const groqResponse = await fetch(GROQ_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || "llama-3.1-8b-instant",
        messages,
        temperature: 0.55,
        max_tokens: 180,
      }),
    });

    const groqPayload = await groqResponse.json();
    if (!groqResponse.ok) {
      console.error("Groq request failed:", groqPayload);
      return sendJson(response, groqResponse.status, {
        error: groqPayload?.error?.message || "Groq could not respond.",
      });
    }

    return sendJson(response, 200, {
      message: {
        role: "assistant",
        content:
          groqPayload.choices?.[0]?.message?.content ||
          "I could not form a reply. Please try again.",
      },
    });
  } catch (error) {
    console.error("Local coach error:", error);
    return sendJson(response, 500, { error: "Local coach connection failed." });
  }
}

function serveStatic(request, response) {
  const requestPath =
    request.url === "/" ? "/index.html" : request.url.split("?")[0];
  const safePath = path.normalize(requestPath).replace(/^([/\\])+/, "");
  const filePath = path.join(ROOT, safePath);

  if (
    !filePath.startsWith(ROOT) ||
    !fs.existsSync(filePath) ||
    fs.statSync(filePath).isDirectory()
  ) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    return response.end("Not found");
  }

  response.writeHead(200, { "Content-Type": contentType(filePath) });
  fs.createReadStream(filePath).pipe(response);
}

const server = http.createServer((request, response) => {
  if (request.url === "/api/chat") return handleChat(request, response);
  return serveStatic(request, response);
});

server.listen(PORT, () => {
  console.log(`Klar is running at http://localhost:${PORT}`);
  console.log(
    process.env.GROQ_API_KEY
      ? "Klar Coach: Groq key loaded."
      : "Klar Coach: no GROQ_API_KEY found yet.",
  );
});
