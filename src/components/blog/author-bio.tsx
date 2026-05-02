import Image from "next/image";

export default function AuthorBio() {
  return (
    <section className="border-t border-surface-container-high">
      <div className="max-w-4xl mx-auto px-6 md:px-8 py-10 md:py-12">
        <div className="flex items-start gap-5">
          <Image
            src="/images/author-pubs.jpg"
            alt="Pubs Abayasiri"
            width={64}
            height={64}
            className="rounded-full shrink-0 object-cover"
          />
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
              Written by
            </p>
            <p className="font-headline font-black text-lg text-foreground">
              Pubs Abayasiri
            </p>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              Pubs Abayasiri has always been a fan of productivity and productivity tools for both fun and practicality. He&apos;s worn many hats, but enjoys creating helpful tools to help others.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
