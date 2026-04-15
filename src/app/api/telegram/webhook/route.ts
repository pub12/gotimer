import { NextRequest, NextResponse } from "next/server";
import { get_db } from "@/lib/db";
import crypto from "crypto";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";

async function send_telegram_message(chat_id: string, text: string) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id, text, parse_mode: "HTML" }),
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const message = body?.message;

    if (!message?.text || !message?.chat?.id) {
      return NextResponse.json({ ok: true });
    }

    const chat_id = String(message.chat.id);
    const text = message.text.trim();
    const username = message.from?.username || null;
    const db = get_db();

    // Handle /start command - generate a link code
    if (text === "/start" || text.startsWith("/start ")) {
      const link_code = crypto.randomUUID().slice(0, 8).toUpperCase();
      const id = crypto.randomUUID();

      // Store the telegram link with a temporary placeholder user_id
      // The user_id will be properly associated when they use /link
      db.prepare(
        `INSERT INTO telegram_links (id, user_id, telegram_chat_id, telegram_username, link_code, linked_at)
         VALUES (?, ?, ?, ?, ?, datetime('now'))`
      ).run(id, "__pending__", chat_id, username, link_code);

      await send_telegram_message(
        chat_id,
        `Welcome to GoTimer notifications!\n\nYour link code is: <b>${link_code}</b>\n\nPaste this code in the GoTimer notification settings to connect your account.`
      );

      return NextResponse.json({ ok: true });
    }

    // Handle /link <code> command - associate with user
    if (text.startsWith("/link ")) {
      const code = text.replace("/link ", "").trim().toUpperCase();

      if (!code) {
        await send_telegram_message(chat_id, "Please provide a link code. Usage: /link YOUR_CODE");
        return NextResponse.json({ ok: true });
      }

      const link = db
        .prepare(`SELECT * FROM telegram_links WHERE link_code = ?`)
        .get(code) as { id: string; user_id: string; telegram_chat_id: string } | undefined;

      if (!link) {
        await send_telegram_message(
          chat_id,
          "Invalid link code. Please use /start to generate a new code."
        );
        return NextResponse.json({ ok: true });
      }

      // Update the chat_id association if needed
      db.prepare(
        `UPDATE telegram_links SET telegram_chat_id = ?, telegram_username = ?, linked_at = datetime('now') WHERE id = ?`
      ).run(chat_id, username, link.id);

      await send_telegram_message(
        chat_id,
        "Your Telegram account has been linked. You will now receive timer notifications here."
      );

      return NextResponse.json({ ok: true });
    }

    // Default response for unknown commands
    await send_telegram_message(
      chat_id,
      "Available commands:\n/start - Generate a link code\n/link CODE - Link your GoTimer account"
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Telegram webhook error:", error);
    return NextResponse.json({ ok: true });
  }
}
