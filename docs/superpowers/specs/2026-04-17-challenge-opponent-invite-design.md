# Challenge Opponent Invite via Email

**Date:** 2026-04-17
**Status:** Approved

## Overview

Add an "Add Opponent" section to the challenge creation form. Users enter an opponent's email address. If the email matches an existing user, they're added as a pending participant and notified in-app + via email. If the email doesn't match, an invite email is sent prompting them to sign up for GoTimer and join the challenge.

## Database Changes

Add two columns to the existing `challenge_invitations` table:

```sql
ALTER TABLE challenge_invitations ADD COLUMN invited_email TEXT;
ALTER TABLE challenge_invitations ADD COLUMN invited_user_id TEXT;
```

- `invited_email` — always stored. Used to match non-users when they eventually sign up.
- `invited_user_id` — set when the email matches an existing user at invite time. NULL otherwise.

No new tables.

## API Changes

### New: `POST /api/challenges/[id]/invite-by-email`

**Auth:** Required

**Request:**
```json
{ "email": "opponent@example.com" }
```

**Logic:**
1. Validate email format.
2. Check if the email belongs to someone already a participant or with a pending invitation for this challenge. If so, return error: "This person is already in the challenge."
3. Look up the email in the users table (via hazo_auth).
4. Create a `challenge_invitation` record with `invited_email`, `invited_user_id` (if found), and a generated token.
5. If existing user: send in-app notification + email with link to `/challenges/invite/{token}`.
6. If non-user: send invite email via Zeptomail with link to `/challenges/invite/{token}`.

**Response:**
```json
{
  "invitation": {
    "id": "...",
    "email": "opponent@example.com",
    "existingUser": true | false,
    "userName": "John" | null,
    "profilePic": "..." | null
  }
}
```

### New: `GET /api/users/lookup?email=...`

**Auth:** Required

**Response (user exists):**
```json
{ "exists": true, "name": "John", "profilePic": "https://..." }
```

**Response (user does not exist):**
```json
{ "exists": false }
```

Only accessible to authenticated users. Returns minimal info for chip display.

### Challenge Creation Flow

Challenge creation and invitations remain separate concerns:
1. Client creates the challenge via `POST /api/challenges`.
2. Client calls `POST /api/challenges/[id]/invite-by-email` for each opponent email.

## Email Templates

Both emails sent via Zeptomail using the existing `hazo_notify` infrastructure.

### Image

Include the challenge's GIF (`gif_url`) if set. Otherwise, fall back to a GoTimer branded header image.

### For Existing Users

- **Subject:** "[Creator name] challenged you on GoTimer"
- **Body:** Challenge name, description, timer type, creator's name, challenge image. CTA button: "View Challenge" linking to `/challenges/invite/{token}`.

### For Non-Users

- **Subject:** "[Creator name] challenged you on GoTimer"
- **Body:** Same challenge details + brief "GoTimer is a competitive timer app" intro, challenge image. CTA button: "Join GoTimer" linking to `/challenges/invite/{token}`.

When non-users land on the invite page without a session, the page shows challenge details and a "Sign up with Google to accept" button. After auth, they redirect back to the invite page to accept.

## UI Changes

### Create Challenge Form — "Add Opponent" Section

Located below existing form fields.

**Components:**
- Email input field with an "Add" button.
- On add: call `GET /api/users/lookup?email=...` for inline resolution.
- Display added opponents as chips:
  - **Existing user chip:** Name + profile pic + remove button.
  - **External invite chip:** Email + "invite" badge + remove button.

**Constraints:**
- Head-to-head format: input disabled after one opponent is added.
- Group format: unlimited additions.
- Inline error if:
  - Email is already added to the list.
  - Email is the creator's own email.
  - Email already belongs to a participant in the challenge.

### On Form Submit

1. Create the challenge via `POST /api/challenges`.
2. Call `POST /api/challenges/[id]/invite-by-email` for each opponent email.
3. Show toast: "Challenge created! Invitations sent."

### Invite Page (`/challenges/invite/[token]`)

No changes for existing users — page already works.

For non-users arriving without a session:
- Show challenge details (name, description, creator, image).
- Show "Sign up with Google to accept" button.
- After auth, redirect back to the same invite page.

## Non-User Sign-Up Matching

When a new user signs up via Google OAuth, their pending invitations need to be discovered.

**Approach:** On first authenticated page load (dashboard or similar), query `challenge_invitations` for rows where `invited_email` matches the user's email and `status = 'pending'`. Update those rows to set `invited_user_id`. The invitations then appear on their dashboard like any other pending invite.

This avoids modifying hazo_auth internals — it's a gotimer-level check that runs on authenticated page load.

## Out of Scope

- Contacts/friends system (future enhancement on top of this).
- Modifying hazo_auth package.
- Push notifications (only in-app + email for now).
