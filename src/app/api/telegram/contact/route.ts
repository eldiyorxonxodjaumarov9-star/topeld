import { NextResponse } from "next/server";
import {
  escapeTelegramHtml,
  isTelegramConfigured,
  sendTelegramMessage,
} from "@/lib/telegram";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      fullName?: string;
      phone?: string;
      email?: string;
    };

    const fullName = body.fullName?.trim() ?? "";
    const phone = body.phone?.trim() ?? "";
    const email = body.email?.trim() ?? "";

    if (!fullName || fullName.length < 2) {
      return NextResponse.json({ error: "Full name is required." }, { status: 400 });
    }

    const phoneDigits = phone.replace(/\D/g, "");
    if (phoneDigits.length < 10) {
      return NextResponse.json({ error: "Valid phone is required." }, { status: 400 });
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Valid email is required." }, { status: 400 });
    }

    if (!isTelegramConfigured()) {
      console.error(
        "[telegram/contact] Token yoki Chat ID yo'q — src/config/telegram.ts ni to'ldiring"
      );
      return NextResponse.json(
        {
          error:
            "Telegram sozlanmagan. src/config/telegram.ts fayliga token va chat ID yozing, keyin serverni qayta ishga tushiring.",
        },
        { status: 503 }
      );
    }

    const submittedAt = new Date().toLocaleString("en-US", {
      timeZone: "America/Chicago",
      dateStyle: "medium",
      timeStyle: "short",
    });

    await sendTelegramMessage({
      text: [
        "<b>TOP ELD — Contact Form</b>",
        "",
        `<b>Name:</b> ${escapeTelegramHtml(fullName)}`,
        `<b>Phone:</b> ${escapeTelegramHtml(phone)}`,
        `<b>Email:</b> ${escapeTelegramHtml(email)}`,
        `<b>Time:</b> ${escapeTelegramHtml(submittedAt)}`,
        "<b>Source:</b> Contact modal",
      ].join("\n"),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[telegram/contact]", error);
    return NextResponse.json(
      { error: "Failed to send notification." },
      { status: 500 }
    );
  }
}
