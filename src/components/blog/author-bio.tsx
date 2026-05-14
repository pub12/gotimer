import Image from "next/image";
import Link from "next/link";

/**
 * AuthorBio — E-E-A-T signal rendered below every blog article body.
 * JSON-LD in blog/[slug]/page.tsx sets author @type: Person — this is the
 * visible counterpart that Google and AI engines use to verify authorship.
 */
export default function AuthorBio() {
  return (
    <section className="border-t border-surface-container-high bg-surface-container-low">
      <div className="max-w-4xl mx-auto px-6 md:px-8 py-10 md:py-12">
        <div className="flex items-center gap-5">
          <div className="shrink-0">
            <Image
              src="/images/author-pubs.jpg"
              alt="Pubs Abayasiri"
              width={64}
              height={64}
              className="rounded-full object-cover ring-2 ring-secondary/30"
            />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-0.5">
              Written by
            </p>
            <p className="font-headline font-black text-foreground text-lg leading-tight">
              Pubs Abayasiri
            </p>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              Builder of{" "}
              <Link
                href="/"
                className="text-secondary font-semibold hover:text-secondary/80 no-underline transition-colors"
              >
                GoTimer.org
              </Link>
              . Passionate about productivity and practical tools, Pubs has
              spent years building free online utilities that make everyday
              tasks easier — from cooking and fitness to study and focus.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
