import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { env } from "~/env";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getBaseUrl() {
  if (typeof window !== "undefined") return window.location.origin;
  if (env.VERCEL_URL) return `https://${env.VERCEL_URL}`;

  return `http://localhost:3000`;
}
