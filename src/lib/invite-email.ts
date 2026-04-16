export function build_invite_email({
  inviter_name,
  challenge_name,
  challenge_description,
  timer_type,
  gif_url,
  invite_url,
  is_existing_user,
}: {
  inviter_name: string;
  challenge_name: string;
  challenge_description: string;
  timer_type: string | null;
  gif_url: string | null;
  invite_url: string;
  is_existing_user: boolean;
}): { html: string; text: string; subject: string } {
  const subject = `${inviter_name} challenged you on GoTimer`;

  const image_html = gif_url
    ? `<img src="${gif_url}" alt="${challenge_name}" style="width:100%;max-height:200px;object-fit:cover;border-radius:8px;margin-bottom:16px;" />`
    : `<div style="background:linear-gradient(135deg,#6366f1,#8b5cf6);height:120px;border-radius:8px;margin-bottom:16px;display:flex;align-items:center;justify-content:center;">
        <span style="font-size:48px;">&#9201;</span>
      </div>`;

  const intro = is_existing_user
    ? ""
    : `<p style="color:#666;font-size:14px;margin-bottom:16px;">GoTimer is a competitive timer app where you can challenge friends and track your wins.</p>`;

  const timer_line = timer_type
    ? `<p style="color:#666;font-size:14px;margin:4px 0;">Timer: <strong>${timer_type.replace(/-/g, " ")}</strong></p>`
    : "";

  const description_line = challenge_description
    ? `<p style="color:#666;font-size:14px;margin:4px 0;">${challenge_description}</p>`
    : "";

  const cta_label = is_existing_user ? "View Challenge" : "Join GoTimer";

  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:500px;margin:0 auto;padding:24px;">
      ${image_html}
      ${intro}
      <h2 style="margin:0 0 8px;font-size:20px;color:#111;">${inviter_name} challenged you!</h2>
      <div style="background:#f9f9f9;border-radius:8px;padding:16px;margin:16px 0;">
        <p style="font-weight:bold;font-size:16px;margin:0 0 8px;color:#111;">${challenge_name}</p>
        ${description_line}
        ${timer_line}
      </div>
      <a href="${invite_url}" style="display:inline-block;background:#6366f1;color:#fff;text-decoration:none;padding:12px 32px;border-radius:8px;font-weight:600;font-size:14px;margin-top:8px;">
        ${cta_label}
      </a>
      <p style="color:#999;font-size:12px;margin-top:24px;">
        If you didn&apos;t expect this email, you can safely ignore it.
      </p>
    </div>
  `;

  const text_lines = [
    `${inviter_name} challenged you on GoTimer!`,
    "",
    `Challenge: ${challenge_name}`,
    challenge_description ? `Description: ${challenge_description}` : "",
    timer_type ? `Timer: ${timer_type.replace(/-/g, " ")}` : "",
    "",
    is_existing_user ? "" : "GoTimer is a competitive timer app where you can challenge friends and track your wins.",
    "",
    `${cta_label}: ${invite_url}`,
  ].filter(Boolean).join("\n");

  return { html, text: text_lines, subject };
}
