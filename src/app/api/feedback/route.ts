import { NextRequest, NextResponse } from "next/server";
import { hazo_get_auth } from "hazo_auth/server-lib";
import { send_email } from "hazo_notify/emailer";

const FEEDBACK_RECIPIENT = process.env.FEEDBACK_EMAIL || "feedback@gotimer.app";

export async function POST(request: NextRequest) {
  const auth = await hazo_get_auth(request);
  if (!auth.authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { subject, message, sender_email, page_url, browser, platform, referrer } = body;

  // Extract sender IP from headers
  const forwarded_for = request.headers.get("x-forwarded-for");
  const sender_ip = forwarded_for ? forwarded_for.split(",")[0].trim() : request.headers.get("x-real-ip") || "unknown";

  // Lookup country from IP
  let sender_country = "unknown";
  try {
    const geo_res = await fetch(`https://ipapi.co/${sender_ip}/country_name/`);
    if (geo_res.ok) {
      const country_text = await geo_res.text();
      if (country_text && !country_text.includes("Undefined")) sender_country = country_text.trim();
    }
  } catch {
    // ignore geo lookup failures
  }

  if (!subject || typeof subject !== "string" || subject.trim().length === 0) {
    return NextResponse.json({ error: "Subject is required" }, { status: 400 });
  }

  if (subject.trim().length > 200) {
    return NextResponse.json({ error: "Subject must be 200 characters or less" }, { status: 400 });
  }

  if (!message || typeof message !== "string" || message.trim().length === 0) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  if (message.trim().length > 5000) {
    return NextResponse.json({ error: "Message must be 5000 characters or less" }, { status: 400 });
  }

  const user_email = auth.user.email_address || "unknown";
  const user_name = auth.user.name || "Unknown User";
  const user_id = auth.user.id;

  try {
    const sender_email_display = sender_email ? String(sender_email).trim() : "";
    const meta_rows = [
      { label: "From", value: `${user_name} (${user_email})` },
      ...(sender_email_display ? [{ label: "Sender Email", value: sender_email_display }] : []),
      { label: "User ID", value: user_id },
      { label: "Subject", value: subject.trim() },
      { label: "Page URL", value: page_url || "unknown" },
      { label: "IP Address", value: sender_ip },
      { label: "Country", value: sender_country },
      { label: "Browser", value: browser || "unknown" },
      { label: "Platform", value: platform || "unknown" },
      { label: "Referrer", value: referrer || "(none)" },
    ];

    const html_rows = meta_rows
      .map((r) => `<tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; width: 120px;">${r.label}:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${r.value}</td></tr>`)
      .join("");
    const text_rows = meta_rows.map((r) => `${r.label}: ${r.value}`).join("\n");

    const result = await send_email({
      to: FEEDBACK_RECIPIENT,
      subject: `[GoTimer Feedback] ${subject.trim()}`,
      content: {
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">New Feedback from GoTimer</h2>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              ${html_rows}
            </table>
            <div style="background: #f9f9f9; padding: 16px; border-radius: 8px; border: 1px solid #eee;">
              <p style="margin: 0; white-space: pre-wrap;">${message.trim()}</p>
            </div>
          </div>
        `,
        text: `New Feedback from GoTimer\n\n${text_rows}\n\n${message.trim()}`,
      },
    });

    if (result.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: "Failed to send feedback" },
        { status: 500 }
      );
    }
  } catch {
    return NextResponse.json(
      { error: "Failed to send feedback" },
      { status: 500 }
    );
  }
}
