import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { id } = req.query;
  const wishes = (await redis.get("wishes")) || [];
  const updated = wishes.filter((wish) => wish.id !== id);
  await redis.set("wishes", updated);
  res.status(200).json(updated);
}
