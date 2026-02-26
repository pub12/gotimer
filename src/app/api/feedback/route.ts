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
  const { subject, message } = body;

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
    const result = await send_email({
      to: FEEDBACK_RECIPIENT,
      subject: `[GoTimer Feedback] ${subject.trim()}`,
      content: {
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">New Feedback from GoTimer</h2>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; width: 100px;">From:</td>
                <td style="padding: 8px; border-bottom: 1px solid #eee;">${user_name} (${user_email})</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">User ID:</td>
                <td style="padding: 8px; border-bottom: 1px solid #eee;">${user_id}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Subject:</td>
                <td style="padding: 8px; border-bottom: 1px solid #eee;">${subject.trim()}</td>
              </tr>
            </table>
            <div style="background: #f9f9f9; padding: 16px; border-radius: 8px; border: 1px solid #eee;">
              <p style="margin: 0; white-space: pre-wrap;">${message.trim()}</p>
            </div>
          </div>
        `,
        text: `New Feedback from GoTimer\n\nFrom: ${user_name} (${user_email})\nUser ID: ${user_id}\nSubject: ${subject.trim()}\n\n${message.trim()}`,
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
