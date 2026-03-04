import { Metadata } from "next";
import { get_db } from "@/lib/db";
import PublicChallengeDetailClient from "./public-challenge-detail-client";

export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const db = get_db();
    const challenges = db
      .prepare(`SELECT id FROM game_challenges WHERE is_public = 1`)
      .all() as { id: string }[];
    return challenges.map((c) => ({ id: c.id }));
  } catch {
    return [];
  }
}

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
        alternates: {
          canonical: `/public-challenges/${id}`,
        },
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

function buildBreadcrumbJsonLd(id: string, name: string) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://gotimer.org",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Public Challenges",
        item: "https://gotimer.org/public-challenges",
      },
      {
        "@type": "ListItem",
        position: 3,
        name,
        item: `https://gotimer.org/public-challenges/${id}`,
      },
    ],
  });
}

export default async function PublicChallengeDetailPage({ params }: Props) {
  const { id } = await params;

  let challengeName = "Challenge";
  try {
    const db = get_db();
    const row = db
      .prepare(`SELECT name FROM game_challenges WHERE id = ? AND is_public = 1`)
      .get(id) as { name: string } | undefined;
    if (row) challengeName = row.name;
  } catch {
    // Use default name
  }

  // JSON-LD breadcrumb - JSON.stringify escapes all special chars, safe for script tag
  const breadcrumbJsonLdString = buildBreadcrumbJsonLd(id, challengeName);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: breadcrumbJsonLdString }}
      />
      <PublicChallengeDetailClient id={id} />
    </>
  );
}
