import { Metadata } from "next";
import { get_db } from "@/lib/db";
import PublicChallengeDetailClient from "./public-challenge-detail-client";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  try {
    const db = get_db();
    const challenge = db
      .prepare(`SELECT name, description, gif_url FROM game_challenges WHERE id = ? AND is_public = 1`)
      .get(id) as { name: string; description: string; gif_url: string | null } | undefined;

    if (challenge) {
      const ogImage = challenge.gif_url || "/fight.jpg";
      const desc = challenge.description || `Check out this challenge on GoTimer!`;
      return {
        title: `${challenge.name} - GoTimer`,
        description: desc,
        openGraph: {
          title: `${challenge.name} - GoTimer`,
          description: desc,
          images: [{ url: ogImage }],
        },
        twitter: {
          card: "summary_large_image",
          title: `${challenge.name} - GoTimer`,
          description: desc,
          images: [ogImage],
        },
      };
    }
  } catch {
    // Fall through to default
  }

  return {
    title: "Challenge - GoTimer",
    description: "View this challenge on GoTimer",
  };
}

export default async function PublicChallengeDetailPage({ params }: Props) {
  const { id } = await params;
  return <PublicChallengeDetailClient id={id} />;
}
