import Link from "next/link";
import { ChevronRight, ArrowRight } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function Page() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex flex-col bg-surface pt-14 pb-12 px-3 w-full md:pt-20 md:px-4">
        <div className="max-w-3xl w-full mx-auto">
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="size-3" />
            <Link href="/streamer-tools" className="hover:text-foreground transition-colors">Streamer Tools</Link>
            <ChevronRight className="size-3" />
            <span className="text-foreground font-medium">OBS Countdown Timer</span>
          </nav>
        </div>

        <section className="max-w-3xl w-full mx-auto">
          <h1 className="font-headline font-black text-3xl md:text-4xl text-foreground mb-3 leading-tight">
            Free OBS Countdown Timer
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            A transparent, URL-configurable countdown overlay for OBS Studio
            Browser Source. No signup, no watermark, no extension. Drop the URL
            into OBS and you have a working countdown.
          </p>

          <Link
            href="/brb"
            className="inline-flex items-center gap-2 px-5 py-3 bg-secondary text-secondary-foreground rounded-xl font-semibold hover:opacity-90 transition-opacity mb-12"
          >
            Open the overlay configurator
            <ArrowRight className="size-4" />
          </Link>

          <div className="space-y-4 text-sm text-muted-foreground leading-relaxed [&_a]:text-secondary [&_a]:underline">
            <h2 className="font-headline font-bold text-xl text-foreground mt-2">
              Why an OBS countdown?
            </h2>
            <p>
              Every regular streamer needs a small set of countdown overlays:
              one for the pre-stream &quot;Starting Soon&quot; scene, one for
              mid-stream BRBs, one for the goodbye and raid hand-off. Each is
              a Browser Source in OBS, each runs a transparent-background
              page, and each is meaningfully better with a visible countdown
              than with a static &quot;back soon&quot; image. The countdown
              answers the implicit question every visitor has when your
              camera cuts away: <em>how long is this wait?</em>
            </p>

            <p>
              This overlay was built around three constraints. First, no
              signup — paste a URL into OBS and it works forever, regardless
              of whether our database is up (the URL has all configuration
              baked in). Second, no watermark — the bare overlay surface
              is just your countdown and your label, with no branding or
              tracking baked in. Third, URL-configurable — you build URLs
              from a Stream Deck macro, a chat bot, or a Discord shortcut
              without ever touching a UI.
            </p>

            <h2 className="font-headline font-bold text-xl text-foreground">
              Pre-built scenarios
            </h2>
            <p>
              Four scenario-specific countdown URLs are built and ready to
              paste:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <Link href="/brb/starting-soon">Stream Starting Soon</Link> —
                a five-minute gold-on-transparent pre-stream countdown
              </li>
              <li>
                <Link href="/brb/be-right-back">Be Right Back</Link> — a
                clean five-minute white-on-transparent intermission
              </li>
              <li>
                <Link href="/brb/stream-over">Stream Ending</Link> — a calm
                two-minute wind-down for end-of-stream goodbyes
              </li>
              <li>
                <Link href="/brb/raid-countdown">Raid Countdown</Link> — a
                one-minute red-on-transparent raid timer that lines up with
                Twitch&apos;s /raid confirmation window
              </li>
            </ul>

            <p>
              Each is its own page with its own pre-filled URL and its own
              FAQ for the scenario. They all share the same underlying
              overlay engine, so the visual and behavioral characteristics
              are consistent across them.
            </p>

            <h2 className="font-headline font-bold text-xl text-foreground">
              Need a custom URL?
            </h2>
            <p>
              The <Link href="/brb">overlay configurator</Link> lets you
              tweak duration, label, color, font, size, alignment, and the
              pulse-on-last-10-seconds animation, then copy the resulting
              URL straight into OBS. The configurator is the canonical
              entry point — bookmark <code>/brb</code> on this site and you
              have one URL to remember.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
