import { NextResponse } from "next/server";
import { getFmcsaNews } from "@/lib/fmcsa-news";

export async function GET() {
  try {
    const posts = await getFmcsaNews();
    return NextResponse.json({ ok: true, posts });
  } catch (error) {
    console.error("[api/news/fmcsa]", error);
    return NextResponse.json(
      { error: "Failed to load FMCSA news." },
      { status: 500 }
    );
  }
}
