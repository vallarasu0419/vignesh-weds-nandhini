import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

const SEED = [
  { id: "w1", name: "A Friend", text: "Wishing you both a lifetime of love and laughter!" },
  { id: "w2", name: "Family", text: "So happy for you two — see you on the big day!" },
];

async function getWishes() {
  const wishes = await redis.get("wishes");
  if (!wishes) {
    await redis.set("wishes", SEED);
    return SEED;
  }
  return wishes;
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    const wishes = await getWishes();
    res.status(200).json(wishes);
    return;
  }

  if (req.method === "POST") {
    const { name, text } = req.body || {};
    if (!name?.trim() || !text?.trim()) {
      res.status(400).json({ error: "Name and wish text are required." });
      return;
    }
    const wishes = await getWishes();
    const wish = { id: `w-${Date.now()}`, name: name.trim(), text: text.trim() };
    const updated = [wish, ...wishes];
    await redis.set("wishes", updated);
    res.status(201).json(updated);
    return;
  }

  res.status(405).json({ error: "Method not allowed" });
}
