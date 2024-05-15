import { headers } from "next/headers";

const getIP = () => {
  const forwardedFor = headers().get("x-forwarded-for");
  const realIp = headers().get("x-real-ip");

  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  if (realIp) {
    return realIp.trim();
  }

  return null;
};

const ipToRequestMap: Record<string, { count: number; expiresAt: number }> = {};

export const rateLimitByUserIP = async (
  limit: number = 1,
  window: number = 10000
) => {
  const ip = getIP();

  if (!ip) {
    throw new Error("IP address not found");
  }

  const currentRequest = ipToRequestMap[ip] || { count: 0, expiresAt: 0 };

  if (!ipToRequestMap[ip]) {
    ipToRequestMap[ip] = currentRequest;
  }

  if (currentRequest.expiresAt < Date.now()) {
    currentRequest.count = 0;
    currentRequest.expiresAt = Date.now() + window;
  }

  currentRequest.count++;

  if (currentRequest.count > limit) {
    throw new Error("Rate limit exceeded");
  }
};
