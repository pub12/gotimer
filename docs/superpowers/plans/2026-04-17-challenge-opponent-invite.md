# Challenge Opponent Invite via Email — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Allow users to invite opponents by email during challenge creation. Existing users get added as pending participants with in-app + email notification. Non-existing users receive an invite email and get matched when they sign up.

**Architecture:** Extends the existing `challenge_invitations` table with `invited_email` and `invited_user_id` columns. New API endpoints for email-based lookup and invite. UI adds an opponent email input with inline resolution to the create challenge form. Post-login check links pending invitations to newly registered users.

**Tech Stack:** Next.js 16 (App Router), better-sqlite3, hazo_auth, hazo_notify (Zeptomail), shadcn/ui, Tailwind CSS 4, Lucide React

---

## File Structure

| Action | File | Responsibility |
|--------|------|----------------|
| Modify | `src/lib/db.ts` | Add migrations 31-32 for new columns |
| Create | `src/app/api/users/lookup/route.ts` | Email-to-user lookup endpoint |
| Create | `src/app/api/challenges/[id]/invite-by-email/route.ts` | Email-based invite + notification |
| Create | `src/lib/invite-email.ts` | HTML email template builder |
| Modify | `src/app/challenges/create/page.tsx` | Add opponent email input + chips UI |
| Create | `src/app/api/challenges/pending-invitations/route.ts` | Check & link pending invitations for current user |
| Modify | `src/app/challenges/page.tsx` | Call pending-invitations on load |

---

### Task 1: Database Migration — Add columns to challenge_invitations

**Files:**
- Modify: `src/lib/db.ts:271-285` (add migrations 31-32 to the `migrations` array)

- [ ] **Step 1: Add migration 31 for invited_email column**

In `src/lib/db.ts`, add after the `version: 30` migration entry (around line 283):

```typescript
  { version: 31, sql: `ALTER TABLE challenge_invitations ADD COLUMN invited_email TEXT` },
  { version: 32, sql: `ALTER TABLE challenge_invitations ADD COLUMN invited_user_id TEXT` },
```

- [ ] **Step 2: Verify the migration runs**

Run:
```bash
npx next build 2>&1 | head -30
```

Or start the dev server and hit any API endpoint that calls `get_db()`. The migration will auto-apply on first DB access.

- [ ] **Step 3: Commit**

```bash
git add src/lib/db.ts
git commit -m "feat: add invited_email and invited_user_id columns to challenge_invitations"
```

---

### Task 2: User Lookup API Endpoint

**Files:**
- Create: `src/app/api/users/lookup/route.ts`

- [ ] **Step 1: Create the user lookup route**

Create `src/app/api/users/lookup/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { hazo_get_auth } from "hazo_auth/server-lib";
import { get_db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const auth = await hazo_get_auth(request);
  if (!auth.authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const email = request.nextUrl.searchParams.get("email");
  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "email parameter required" }, { status: 400 });
  }

  const trimmed = email.trim().toLowerCase();
  if (!trimmed || !trimmed.includes("@")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const db = get_db();
  const user = db
    .prepare(
      `SELECT id, name, profile_picture_url FROM hazo_users WHERE LOWER(email_address) = ?`
    )
    .get(trimmed) as { id: string; name: string | null; profile_picture_url: string | null } | undefined;

  if (!user) {
    return NextResponse.json({ exists: false });
  }

  return NextResponse.json({
    exists: true,
    name: user.name || "Unknown",
    profilePic: user.profile_picture_url || null,
  });
}
```

- [ ] **Step 2: Test manually**

Run:
```bash
curl -s http://localhost:3000/api/users/lookup?email=test@example.com | jq .
```

Expected: `{ "exists": false }` for a non-existent email.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/users/lookup/route.ts
git commit -m "feat: add user lookup by email API endpoint"
```

---

### Task 3: Invite Email Template Builder

**Files:**
- Create: `src/lib/invite-email.ts`

- [ ] **Step 1: Create the email template module**

Create `src/lib/invite-email.ts`:

```typescript
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
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/invite-email.ts
git commit -m "feat: add invite email HTML template builder"
```

---

### Task 4: Invite-by-Email API Endpoint

**Files:**
- Create: `src/app/api/challenges/[id]/invite-by-email/route.ts`

- [ ] **Step 1: Create the invite-by-email route**

Create `src/app/api/challenges/[id]/invite-by-email/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { hazo_get_auth } from "hazo_auth/server-lib";
import { get_db } from "@/lib/db";
import { send_email } from "hazo_notify/emailer";
import { build_invite_email } from "@/lib/invite-email";
import crypto from "crypto";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await hazo_get_auth(request);
  if (!auth.authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const email = (body.email || "").trim().toLowerCase();

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  // Don't allow inviting yourself
  if (email === auth.user.email_address?.toLowerCase()) {
    return NextResponse.json({ error: "You cannot invite yourself" }, { status: 400 });
  }

  const db = get_db();

  // Verify challenge exists and user is a participant
  const challenge = db
    .prepare(`SELECT * FROM game_challenges WHERE id = ?`)
    .get(id) as Record<string, unknown> | undefined;

  if (!challenge) {
    return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
  }

  const is_participant = db
    .prepare(`SELECT id FROM challenge_participants WHERE challenge_id = ? AND user_id = ?`)
    .get(id, auth.user.id);

  if (!is_participant) {
    return NextResponse.json({ error: "Not a participant" }, { status: 403 });
  }

  // Check if email already has a pending invitation for this challenge
  const existing_invite = db
    .prepare(
      `SELECT id FROM challenge_invitations WHERE challenge_id = ? AND invited_email = ? AND status = 'pending'`
    )
    .get(id, email);

  if (existing_invite) {
    return NextResponse.json(
      { error: "This person already has a pending invitation" },
      { status: 409 }
    );
  }

  // Check if the email belongs to someone already a participant
  const user = db
    .prepare(`SELECT id, name, profile_picture_url FROM hazo_users WHERE LOWER(email_address) = ?`)
    .get(email) as { id: string; name: string | null; profile_picture_url: string | null } | undefined;

  if (user) {
    const already_participant = db
      .prepare(`SELECT id FROM challenge_participants WHERE challenge_id = ? AND user_id = ?`)
      .get(id, user.id);

    if (already_participant) {
      return NextResponse.json(
        { error: "This person is already in the challenge" },
        { status: 409 }
      );
    }
  }

  // Create invitation
  const token = crypto.randomBytes(32).toString("hex");
  const invite_id = crypto.randomUUID();

  db.prepare(
    `INSERT INTO challenge_invitations (id, challenge_id, token, invited_by, invited_email, invited_user_id)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).run(invite_id, id, token, auth.user.id, email, user?.id || null);

  // Build and send email
  const origin = request.headers.get("origin") || request.nextUrl.origin;
  const invite_url = `${origin}/challenges/invite/${token}`;

  const { html, text, subject } = build_invite_email({
    inviter_name: auth.user.name || "Someone",
    challenge_name: challenge.name as string,
    challenge_description: (challenge.description as string) || "",
    timer_type: (challenge.timer_type as string) || null,
    gif_url: (challenge.gif_url as string) || null,
    invite_url,
    is_existing_user: !!user,
  });

  // Send email (fire and forget — don't block on failure)
  send_email({ to: email, subject, content: { html, text } }).catch((err) =>
    console.error("Failed to send invite email:", err)
  );

  return NextResponse.json(
    {
      invitation: {
        id: invite_id,
        email,
        existingUser: !!user,
        userName: user?.name || null,
        profilePic: user?.profile_picture_url || null,
      },
    },
    { status: 201 }
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/api/challenges/[id]/invite-by-email/route.ts
git commit -m "feat: add invite-by-email API endpoint with email notifications"
```

---

### Task 5: Pending Invitations Check API

**Files:**
- Create: `src/app/api/challenges/pending-invitations/route.ts`

- [ ] **Step 1: Create the pending invitations route**

This endpoint is called on dashboard load. It finds any `challenge_invitations` where `invited_email` matches the current user's email but `invited_user_id` is NULL (meaning they signed up after the invite was sent), links them, and returns the count.

Create `src/app/api/challenges/pending-invitations/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { hazo_get_auth } from "hazo_auth/server-lib";
import { get_db } from "@/lib/db";

export async function POST(request: NextRequest) {
  const auth = await hazo_get_auth(request);
  if (!auth.authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const email = auth.user.email_address?.toLowerCase();
  if (!email) {
    return NextResponse.json({ linked: 0 });
  }

  const db = get_db();

  // Find pending invitations for this email that haven't been linked yet
  const unlinked = db
    .prepare(
      `SELECT id FROM challenge_invitations
       WHERE LOWER(invited_email) = ? AND invited_user_id IS NULL AND status = 'pending'`
    )
    .all(email) as { id: string }[];

  if (unlinked.length === 0) {
    return NextResponse.json({ linked: 0 });
  }

  // Link them to this user
  const update_stmt = db.prepare(
    `UPDATE challenge_invitations SET invited_user_id = ? WHERE id = ?`
  );
  const link_all = db.transaction(() => {
    for (const inv of unlinked) {
      update_stmt.run(auth.user.id, inv.id);
    }
  });
  link_all();

  return NextResponse.json({ linked: unlinked.length });
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/api/challenges/pending-invitations/route.ts
git commit -m "feat: add pending invitations linking endpoint for new signups"
```

---

### Task 6: UI — Add Opponent Email Input to Create Challenge Form

**Files:**
- Modify: `src/app/challenges/create/page.tsx`

This is the largest task. We add an opponent section to the form with email input, inline user lookup, and chip display.

- [ ] **Step 1: Add state variables for opponents**

In `src/app/challenges/create/page.tsx`, add these state variables inside `CreateChallengeForm()`, after the existing state declarations (around line 38, after the `join_code` state):

```typescript
  const [opponent_emails, set_opponent_emails] = useState<
    { email: string; exists: boolean; name: string | null; profilePic: string | null }[]
  >([]);
  const [opponent_input, set_opponent_input] = useState("");
  const [opponent_error, set_opponent_error] = useState<string | null>(null);
  const [looking_up, set_looking_up] = useState(false);
```

- [ ] **Step 2: Add the add_opponent handler**

Add this function after the existing `useEffect` hooks (around line 70, before `handle_create`):

```typescript
  const add_opponent = async () => {
    const email = opponent_input.trim().toLowerCase();
    set_opponent_error(null);

    if (!email || !email.includes("@")) {
      set_opponent_error("Enter a valid email address");
      return;
    }

    if (opponent_emails.some((o) => o.email === email)) {
      set_opponent_error("This email is already added");
      return;
    }

    set_looking_up(true);
    try {
      const res = await fetch(`/api/users/lookup?email=${encodeURIComponent(email)}`);
      const data = await res.json();

      set_opponent_emails((prev) => [
        ...prev,
        {
          email,
          exists: data.exists || false,
          name: data.name || null,
          profilePic: data.profilePic || null,
        },
      ]);
      set_opponent_input("");
    } catch {
      set_opponent_error("Failed to look up email");
    } finally {
      set_looking_up(false);
    }
  };

  const remove_opponent = (email: string) => {
    set_opponent_emails((prev) => prev.filter((o) => o.email !== email));
  };
```

- [ ] **Step 3: Modify handle_create to send invitations after challenge creation**

Replace the existing `handle_create` function with:

```typescript
  const handle_create = async () => {
    if (!name.trim()) return;
    set_saving(true);

    try {
      const res = await fetch("/api/challenges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          gif_url: gif_url || undefined,
          is_public,
          game_id: selected_game_id || undefined,
          format,
          timer_type: timer_type || undefined,
        }),
      });

      if (res.ok) {
        const challenge = await res.json();
        set_created_id(challenge.id);
        if (challenge.join_code) {
          set_join_code(challenge.join_code);
        }

        // Send email invitations for each opponent
        for (const opponent of opponent_emails) {
          fetch(`/api/challenges/${challenge.id}/invite-by-email`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: opponent.email }),
          }).catch(() => {});
        }

        // Generate invite link (for head-to-head / non-group) if no opponents added
        if (format !== "group" && opponent_emails.length === 0) {
          const invite_res = await fetch(
            `/api/challenges/${challenge.id}/invite`,
            { method: "POST" }
          );
          if (invite_res.ok) {
            const invite = await invite_res.json();
            set_invite_url(invite.invite_url);
          }
        }
      }
    } finally {
      set_saving(false);
    }
  };
```

- [ ] **Step 4: Add the opponent section UI to the JSX**

Add this section in the form's `<div className="space-y-4">` block, after the Format section (after the closing `</div>` of the format section around line 327, before the timer_type conditional). Add the `Mail` import to the lucide-react imports at line 10.

Add to imports at line 10:
```typescript
import { ArrowLeft, Image, X, ChevronDown, Plus, Mail, UserCheck } from "lucide-react";
```

Add JSX after the format section:

```tsx
              {format !== "solo" && (
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    {format === "head-to-head" ? "Opponent" : "Opponents"} (optional)
                  </label>

                  {/* Added opponents as chips */}
                  {opponent_emails.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {opponent_emails.map((o) => (
                        <div
                          key={o.email}
                          className="flex items-center gap-2 bg-muted rounded-full pl-3 pr-1 py-1 text-sm"
                        >
                          {o.exists ? (
                            <>
                              {o.profilePic && (
                                <img
                                  src={o.profilePic}
                                  alt=""
                                  className="w-5 h-5 rounded-full"
                                />
                              )}
                              <UserCheck className="w-3.5 h-3.5 text-green-600" />
                              <span>{o.name}</span>
                            </>
                          ) : (
                            <>
                              <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                              <span>{o.email}</span>
                              <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                                invite
                              </span>
                            </>
                          )}
                          <button
                            type="button"
                            onClick={() => remove_opponent(o.email)}
                            className="ml-1 p-1 rounded-full hover:bg-background/60 cursor-pointer border-none bg-transparent"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Email input — hidden if head-to-head and already have one */}
                  {!(format === "head-to-head" && opponent_emails.length >= 1) && (
                    <div className="flex gap-2">
                      <input
                        type="email"
                        value={opponent_input}
                        onChange={(e) => {
                          set_opponent_input(e.target.value);
                          set_opponent_error(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            add_opponent();
                          }
                        }}
                        placeholder="Enter email address"
                        className="flex-1 p-3 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={add_opponent}
                        disabled={looking_up}
                      >
                        {looking_up ? "..." : "Add"}
                      </Button>
                    </div>
                  )}

                  {opponent_error && (
                    <p className="text-sm text-destructive mt-1">{opponent_error}</p>
                  )}
                </div>
              )}
```

- [ ] **Step 5: Update the success screen to mention invitations sent**

In the success screen (the `created_id` truthy branch), update the message when opponents were invited. Replace the existing `<h2>` and first `<p>` in the success section (around lines 357-358) by wrapping them:

After `<div className="text-4xl mb-4">🎉</div>`, replace:
```tsx
            <h2 className="text-2xl font-bold mb-2">Challenge Created!</h2>
```
with:
```tsx
            <h2 className="text-2xl font-bold mb-2">Challenge Created!</h2>
            {opponent_emails.length > 0 && (
              <p className="text-sm text-muted-foreground mb-4">
                {opponent_emails.length === 1
                  ? "Invitation sent to your opponent!"
                  : `Invitations sent to ${opponent_emails.length} opponents!`}
              </p>
            )}
```

- [ ] **Step 6: Test the full flow manually**

1. Start the dev server: `npm run dev`
2. Go to `/challenges/create`
3. Fill in a challenge name, select "1v1" format
4. Enter an email in the opponent field, click "Add"
5. Verify: existing user shows name + green check, non-user shows email + "invite" badge
6. Add a second email — should be blocked for head-to-head
7. Switch to "Group" format — should allow multiple
8. Click "Create Challenge" — should show success with invitations sent message
9. Check email delivery in Zeptomail logs

- [ ] **Step 7: Commit**

```bash
git add src/app/challenges/create/page.tsx
git commit -m "feat: add opponent email input with inline lookup to challenge creation form"
```

---

### Task 7: Call Pending Invitations on Challenges Dashboard Load

**Files:**
- Modify: `src/app/challenges/page.tsx:36-47`

- [ ] **Step 1: Add pending invitations check on mount**

In `src/app/challenges/page.tsx`, inside the existing `useEffect` that fetches challenges (around line 36), add a call to the pending-invitations endpoint before fetching challenges. This ensures any newly-signed-up user gets their invitations linked before the challenge list loads.

Add this right after the `if (!authenticated)` early return (around line 40), before the `fetch("/api/challenges")` call:

```typescript
    // Link any pending invitations for this user (handles new signups)
    fetch("/api/challenges/pending-invitations", { method: "POST" }).catch(() => {});

```

This is fire-and-forget — it runs before the challenge list fetch but doesn't block it.

- [ ] **Step 2: Commit**

```bash
git add src/app/challenges/page.tsx
git commit -m "feat: link pending invitations on challenges dashboard load"
```

---

### Task 8: End-to-End Verification

- [ ] **Step 1: Test existing user flow**

1. Create a challenge with an existing user's email as opponent
2. Verify the invitation record in the DB has `invited_email` and `invited_user_id` set
3. Verify the user receives an email with challenge details and GIF
4. Log in as that user, go to `/challenges` — invitations should be visible
5. Accept the invitation — verify they join the challenge

- [ ] **Step 2: Test non-existing user flow**

1. Create a challenge with a non-existing email as opponent
2. Verify the invitation record has `invited_email` set and `invited_user_id` is NULL
3. Verify the email is sent with "Join GoTimer" CTA
4. Click the invite link — should see challenge details + "Sign up with Google" prompt
5. After signing up, go to `/challenges` — the pending invitation should now be linked
6. Accept the invitation

- [ ] **Step 3: Test validation edge cases**

1. Try adding your own email — should show error
2. Try adding the same email twice — should show error
3. Try adding a second opponent in head-to-head — input should be hidden
4. Switch format to group — input should reappear
5. Create a solo challenge — opponent section should not appear

- [ ] **Step 4: Final commit if any fixes were needed**

```bash
git add -A
git commit -m "fix: address issues found during e2e testing"
```
