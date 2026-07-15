import { Redis } from "@upstash/redis";

let redis: Redis | null | undefined;

export function getRedis(): Redis | null {
  if (redis !== undefined) return redis;

  // Upstash direct OR Vercel Marketplace KV env names
  const url =
    process.env.UPSTASH_REDIS_REST_URL?.trim() ||
    process.env.KV_REST_API_URL?.trim();
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN?.trim() ||
    process.env.KV_REST_API_TOKEN?.trim();

  if (!url || !token) {
    redis = null;
    return null;
  }

  redis = new Redis({ url, token });
  return redis;
}

export function isRedisConfigured(): boolean {
  return getRedis() !== null;
}
