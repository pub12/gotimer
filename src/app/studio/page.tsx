import type { Metadata } from "next";
import Header from "@/components/header";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import StudioPageClient from "@/components/studio/studio-page";

export const metadata: Metadata = {
  title: "My Timer Studio | GoTimer",
  description: "Save, organize, and quick-launch your favorite timers. Your personal timer dashboard.",
};

export default function StudioPage() {
  return (
    <main className="min-h-screen flex flex-col bg-surface">
      <Header />
      <Navbar />
      <div className="flex-1 pt-14 md:pt-20">
        <StudioPageClient />
      </div>
      <Footer />
    </main>
  );
}
