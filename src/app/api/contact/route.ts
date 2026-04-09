import { NextResponse } from "next/server";

const RATE_LIMIT_MAP = new Map<string, number>();
const RATE_LIMIT_WINDOW = 60_000;

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const lastRequest = RATE_LIMIT_MAP.get(ip);
  const now = Date.now();
  if (lastRequest && now - lastRequest < RATE_LIMIT_WINDOW) {
    return NextResponse.json({ error: "Too many requests. Please wait a moment." }, { status: 429 });
  }
  RATE_LIMIT_MAP.set(ip, now);

  try {
    const body = await req.json();
    const { name, email, subject, message } = body;
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    // TODO: Replace with Resend integration once API key is configured
    console.log("Contact form submission:", { name, email, subject, message });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
