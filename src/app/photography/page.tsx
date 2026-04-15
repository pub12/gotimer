import type { Metadata } from "next";
import { CategoryPageTemplate } from "@/components/category-page/category-page-template";
import { get_category } from "@/lib/site-categories";

const category = get_category("photography")!;

export const metadata: Metadata = {
  title: `${category.heading} | GoTimer`,
  description: category.description,
  alternates: { canonical: `https://gotimer.org/${category.slug}` },
  openGraph: {
    title: `${category.heading} | GoTimer`,
    description: category.description,
    url: `https://gotimer.org/${category.slug}`,
  },
};

export default function Page() {
  return <CategoryPageTemplate category={category} />;
}
