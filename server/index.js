import { createServer } from "node:http";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, "data", "wishes.json");
const PORT = 5175;

async function readWishes() {
  const raw = await readFile(DATA_FILE, "utf-8");
  return JSON.parse(raw);
}

async function writeWishes(wishes) {
  await writeFile(DATA_FILE, JSON.stringify(wishes, null, 2));
}

function send(res, status, body) {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(JSON.stringify(body));
}

const server = createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    send(res, 204, {});
    return;
  }

  if (req.url === "/api/wishes" && req.method === "GET") {
    const wishes = await readWishes();
    send(res, 200, wishes);
    return;
  }

  if (req.url?.startsWith("/api/wishes/") && req.method === "DELETE") {
    const id = decodeURIComponent(req.url.slice("/api/wishes/".length));
    const wishes = await readWishes();
    const updated = wishes.filter((wish) => wish.id !== id);
    await writeWishes(updated);
    send(res, 200, updated);
    return;
  }

  if (req.url === "/api/wishes" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", async () => {
      try {
        const { name, text } = JSON.parse(body);
        if (!name?.trim() || !text?.trim()) {
          send(res, 400, { error: "Name and wish text are required." });
          return;
        }
        const wishes = await readWishes();
        const wish = { id: `w-${Date.now()}`, name: name.trim(), text: text.trim() };
        const updated = [wish, ...wishes];
        await writeWishes(updated);
        send(res, 201, updated);
      } catch {
        send(res, 400, { error: "Invalid request body." });
      }
    });
    return;
  }

  send(res, 404, { error: "Not found" });
});

server.listen(PORT, () => {
  console.log(`Guest wishes API listening on http://localhost:${PORT}`);
});
