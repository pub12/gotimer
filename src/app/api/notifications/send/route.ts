import { NextRequest, NextResponse } from "next/server";
import { get_db } from "@/lib/db";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, channel, title, body: msg_body, url } = body;

    if (!user_id || !channel || !title) {
      return NextResponse.json(
        { error: "user_id, channel, and title are required" },
        { status: 400 }
      );
    }

    const db = get_db();

    if (channel === "push") {
      const subscriptions = db
        .prepare(`SELECT * FROM push_subscriptions WHERE user_id = ?`)
        .all(user_id) as { endpoint: string; p256dh: string; auth: string }[];

      if (subscriptions.length === 0) {
        return NextResponse.json({ error: "No push subscriptions found" }, { status: 404 });
      }

      // TODO: Send via web-push library once installed
      // For each subscription, use web-push to send the notification payload:
      // {
      //   title,
      //   body: msg_body,
      //   url,
      //   icon: '/icon-192.png'
      // }
      // Example:
      // import webpush from 'web-push';
      // for (const sub of subscriptions) {
      //   await webpush.sendNotification(
      //     { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
      //     JSON.stringify({ title, body: msg_body, url })
      //   );
      // }

      return NextResponse.json({
        sent: true,
        channel: "push",
        subscription_count: subscriptions.length,
        note: "web-push sending not yet implemented",
      });
    }

    if (channel === "telegram") {
      const links = db
        .prepare(`SELECT * FROM telegram_links WHERE user_id = ?`)
        .all(user_id) as { telegram_chat_id: string }[];

      if (links.length === 0) {
        return NextResponse.json({ error: "No Telegram links found" }, { status: 404 });
      }

      const results = await Promise.allSettled(
        links.map(async (link) => {
          const text = url
            ? `<b>${title}</b>\n${msg_body || ""}\n\n<a href="${url}">Open Timer</a>`
            : `<b>${title}</b>\n${msg_body || ""}`;

          const res = await fetch(
            `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                chat_id: link.telegram_chat_id,
                text,
                parse_mode: "HTML",
              }),
            }
          );
          return res.ok;
        })
      );

      const sent_count = results.filter(
        (r) => r.status === "fulfilled" && r.value
      ).length;

      return NextResponse.json({ sent: true, channel: "telegram", sent_count });
    }

    if (channel === "email") {
      // TODO: Integrate with Resend for email notifications
      // Example:
      // import { Resend } from 'resend';
      // const resend = new Resend(process.env.RESEND_API_KEY);
      // await resend.emails.send({
      //   from: 'GoTimer <notifications@gotimer.app>',
      //   to: user_email,
      //   subject: title,
      //   html: `<p>${msg_body}</p><p><a href="${url}">Open Timer</a></p>`,
      // });

      return NextResponse.json({
        sent: false,
        channel: "email",
        note: "Email sending not yet implemented",
      });
    }

    return NextResponse.json({ error: `Unknown channel: ${channel}` }, { status: 400 });
  } catch (error) {
    console.error("Error sending notification:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
