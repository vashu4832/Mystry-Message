import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// For sending anonymous messages — public endpoint, no login required.
// 5 messages per 60 seconds, per IP address.
export const messageRateLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "60 s"),
    analytics: true,
    prefix: "ratelimit:send-message",
});

// For AI-backed routes (suggestions, insights) — these cost real money per call.
// 3 requests per 60 seconds.
export const aiRateLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, "60 s"),
    analytics: true,
    prefix: "ratelimit:ai",
});