import { Metadata } from "next";
import { get_db } from "@/lib/db";
import InvitePageClient from "./invite-page-client";

type Props = {
  params: Promise<{ token: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { token } = await params;
  const db = get_db();

  const invitation = db
    .prepare(
      `SELECT gc.name, gc.description, gc.gif_url
       FROM challenge_invitations ci
       INNER JOIN game_challenges gc ON gc.id = ci.challenge_id
       WHERE ci.token = ?`
    )
    .get(token) as { name: string; description: string; gif_url: string | null } | undefined;

  if (!invitation) {
    return { title: "Challenge Invitation" };
  }

  const description = invitation.description
    ? `${invitation.name} - ${invitation.description}`
    : invitation.name;

  const ogImage = invitation.gif_url || "/fight.jpg";

  return {
    title: "Game on - you've been challenged!",
    description,
    openGraph: {
      title: "Game on - you've been challenged!",
      description,
      type: "website",
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Game on - you've been challenged!",
      description,
      images: [ogImage],
    },
  };
}

export default async function InvitePage({ params }: Props) {
  const { token } = await params;
  return <InvitePageClient token={token} />;
}
