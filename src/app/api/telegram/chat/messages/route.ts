import { NextResponse } from "next/server";
import { getChatMessages } from "@/lib/chat-session-store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("sessionId")?.trim() ?? "";
  const since = searchParams.get("since")?.trim() || undefined;

  if (!sessionId) {
    return NextResponse.json({ error: "Session ID is required." }, { status: 400 });
  }

  const messages = await getChatMessages(sessionId, since);
  return NextResponse.json({ messages });
}
