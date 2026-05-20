# GoTimer Outreach Pack — Sequence A

**Date:** 2026-05-19
**Status:** Sequence A live in production (10 niches, ~80 SEO pages)
**Read this first:** the "How to use" section below. Then work through one contact per evening — not all at once.

---

## How to use this document

**Tone rule.** Every first email here is a *question*, not a pitch. The product gets mentioned briefly but it's not the ask. Your example reply chains with Robert Eldridge and Annette Lamb prove this works because the recipient feels respected, not marketed to. The pitch (if any) happens in the *second* email, after they've replied.

**Pacing rule.** Send no more than 2 emails per evening. Wait 7-10 days. If no reply: send the one-line follow-up template at the bottom, once. Then move on.

**Customisation rule.** Every email below has `[bracketed]` slots. Fill them in with something you've actually read, watched, or noticed about that person. If you haven't, pick a different person — don't fake it.

**Disclosure rule.** Always say you're the builder. Never use tracking pixels or shortened/utm links. Use plain `gotimer.org/...` URLs.

**Tracking.** After each send, append a row to `docs/outreach/contacts.csv` (create the file with the schema at the bottom of this doc). Review weekly.

---

## Your personal hook (pick one per email)

Use whichever fits the niche you're pitching. These are written in your voice — feel free to edit.

**Hook A — generic (works everywhere):**
> I built gotimer.org as a side project — got tired of timer sites that ask for an email before they'll count to five. It started small and grew sideways into a handful of niche timer collections, [niche] being one of them.

**Hook B — family / classroom:**
> I got into building gotimer.org partly because my kids' teachers cycle through timer apps that ad-spam Year 4s before the timer even starts. I wanted something that just worked, no signup, no upsell.

**Hook C — coffee / tea / sauna (hobby-driven):**
> I got into pour-over [or "sauna" / "loose-leaf tea"] over the last couple of years and kept hitting the same wall — every timer I found wanted my email, or buried the actual timing UI under three pop-ups. So I started building my own as a side project. It grew.

**Hook D — debate / streamer / board games (tool-driven):**
> I built gotimer.org as a side project — started with generic countdown timers and kept getting requests from friends in [debate / streaming / heavy-board-games] for niche features that no existing tool had. So I built them.

---

## Contact 1 — Glenn Auerbach (SaunaTimes)

**Niche:** Sauna / cold-plunge
**Pages to send:** `gotimer.org/wellness/sauna-timer`, `gotimer.org/wellness/contrast-therapy/11-minute-cold-protocol`

**Why him.** Glenn runs SaunaTimes — has been writing about authentic Finnish sauna practice since ~2010. He's a credibility node for the English-speaking sauna community. He doesn't need traffic, he doesn't sell ads heavily, and he engages thoughtfully with people who ask real questions about practice (not just "is sauna good"). High chance of a thoughtful reply if you ask a real question. Don't expect a feature — expect a relationship that pays off in a year.

**Contact.** SaunaTimes.com → "Contact" link in the footer. Email also discoverable from Whois / about page. Comment on a recent post first if you want to warm it up.

**Subject:** A question about contrast-therapy timing from a tool builder

**Body:**
> Hi Glenn,
>
> Long-time reader — your piece on löyly and breath being the actual variable (not heat) was the one that made me realise I'd been chasing the wrong number for a year.
>
> I'm a tech guy and built gotimer.org as a side project — got tired of timer sites that ask for an email before they'll count to five. Sauna was one of the niches I added because none of the existing timers handle the contrast-therapy pattern (hot phase → cold phase → rest → repeat) without making you start three separate stopwatches.
>
> One question I'd love your view on: in the sauna community you talk to, is there a "standard" people actually use, or is contrast therapy still mostly improvised round to round? I've baked in three presets (an 11-minute cold protocol, a Wim Hof-adjacent variant, and a 15/3/rest) and I'm not sure whether structured timing is even something experienced practitioners want, or whether it's a beginner crutch.
>
> Even a brief reply would be useful — I'd rather know it's a beginner-only need before I add more presets.
>
> Cheers,
> Pubs
> gotimer.org

**After they reply.** Don't ask for a mention. If he asks what's at `/sauna`, send the link and ask if any preset would be wrong by his standards. That's the second email.

---

## Contact 2 — Lance Hedrick

**Niche:** Coffee (pour-over + espresso)
**Pages to send:** `gotimer.org/kitchen/pour-over-timer/tetsu-kasuya-4-6`, `gotimer.org/kitchen/pour-over-timer/hoffmann-v60`, `gotimer.org/kitchen/espresso-timer/pre-infusion`

**Why him.** ~200k IG, the most active "explainer" coffee creator in the English-speaking world right now. His audience is exactly the demographic that bookmarks niche timer URLs. He's known for replying to thoughtful DMs, especially ones that reference a specific video. He won't feature you on a whim — but a friendly first-contact now means he might remember you the next time he's listing free tools for beginners. Coffee is your most page-rich niche (13 pages), so a single Lance signal-boost = months of warm traffic across all of them.

**Contact.** IG DM (`@lancehedrick` — highest reply rate). Patreon message as fallback. Skip email; he doesn't seem to read it.

**Subject (only if you fall back to email):** Tetsu Kasuya 4:6 — built a timer after your video

**Body (DM-friendly, ~150 words):**
> Hi Lance — quick one. Your breakdown of *why* the 4:6 ratio works (the "first two pours dial sweetness, last three dial strength" framing) was what made me build a timer that walks through Kasuya's 5 pours individually instead of just running a 3:30 stopwatch. It's at gotimer.org/kitchen/pour-over-timer/tetsu-kasuya-4-6 — free, no signup. Each pour is its own phase with the target weight beside it, so you can dial sweetness vs. strength without recounting.
>
> One question if you have a sec: when you teach the 4:6 in person, do you actually want the timer to *enforce* the pour schedule, or do you let people fall behind because that's part of the learning? I'm wondering whether "next-pour-due-now" alerts help or whether they're a crutch.
>
> No expectation of a share — just curious what you'd actually want from a tool here. Thanks for the videos.
>
> Pubs / gotimer.org

**After they reply.** If positive, send the espresso pre-infusion timer next. Don't bundle requests. Don't ask for an IG mention. If he organically shares it later, great; if not, you've got a thread to come back to in 6 months when you ship a v2.

---

## Contact 3 — Mark Prince (CoffeeGeek)

**Niche:** Coffee — editorial / authority
**Pages to send:** `gotimer.org/kitchen/pour-over-timer`, `gotimer.org/kitchen/espresso-timer`

**Why him.** CoffeeGeek is the longest-running independent coffee site on the web (since 2001). Mark has watched every "free coffee tool" come and go for 25 years. He's a sharp, no-bullshit editor who will tell you if your tool is interesting or generic. A note in his round-up of coffee web tools is worth more than 10 Instagram features because the page stays indexed forever. Lower probability of reply than Lance, but the prize is bigger.

**Contact.** CoffeeGeek.com → editorial contact form. He also has a personal Twitter (`@CoffeeGeek`).

**Subject:** A small coffee timer question from a builder

**Body:**
> Hi Mark,
>
> I've been reading CoffeeGeek on and off for years — your review of the original Aeropress is the article I link people to when they ask why I drink coffee at all.
>
> I built gotimer.org as a side project — started with generic countdown timers and kept adding niche presets when people asked. Coffee turned into the biggest one because every existing pour-over timer I could find either wanted my email or only handled a single recipe.
>
> A question I'd love your view on: in 25 years of writing about coffee tools, what's the feature you keep waiting for someone to ship in a free web timer that nobody's done yet? I'm specifically asking before I add more presets, because I'd rather invest in the missing feature than the 14th recipe page.
>
> I've put what's there now at gotimer.org/kitchen/pour-over-timer and the espresso side at gotimer.org/kitchen/espresso-timer — but the gap is the more interesting question.
>
> Even a one-line reply would be hugely useful.
>
> Cheers,
> Pubs

**After they reply.** If he names a missing feature, *actually build it*, then write back with "you said X, I built it, here's the URL." That's the strongest possible follow-up. Don't ask for inclusion in a round-up — let it come up naturally if he's interested.

---

## Contact 4 — Don Mei (MeiLeaf)

**Niche:** Tea (especially gongfu, pu-erh, oolong)
**Pages to send:** `gotimer.org/kitchen/tea-timer/gongfu`, `gotimer.org/kitchen/tea-timer/pu-erh`, `gotimer.org/kitchen/tea-timer`

**Why him.** MeiLeaf YouTube is the most-watched English-language tea education channel by a wide margin. Don teaches gongfu cha to a global audience and runs a tea shop in London. His audience overlaps almost perfectly with the people who'd use a multi-cup/gongfu timer. He's not a tool-reviewer though — he's a tea person. So the email is about whether the *practice* of timing infusions matters, not about your tool features.

**Contact.** MeiLeaf.com → "Contact" form, or `hello@meileaf.com` (check the site footer to confirm current address). Don himself is reachable via the channel community tab if you've been subbed for a while.

**Subject:** A question about gongfu timing from a tool builder

**Body:**
> Hi Don,
>
> I've been watching the MeiLeaf channel for a couple of years now — your "what is gongfu cha actually for" video shifted how I drink everything, not just oolong.
>
> I built gotimer.org as a side project. Tea was one of the niches I added because I kept brewing pu-erh and forgetting which infusion I was on, and every "tea timer" I could find was a kitchen-egg-timer reskin. So I built a gongfu mode that auto-progresses through 8 infusions with the per-infusion seconds baked in, and a multi-cup grid for when there's more than one teaware on the table.
>
> One question I'd love your view on: in your experience teaching people gongfu, is a fixed per-infusion seconds schedule (e.g., 10s, 15s, 20s, 25s...) actually correct, or does it actively work against the "use your senses" instinct you try to build in students? I'm worried I've built something that helps beginners but tells experienced drinkers to ignore their tea.
>
> The page is at gotimer.org/kitchen/tea-timer/gongfu if you want to take a look (no signup, no ads). But the question is the more interesting bit.
>
> Cheers,
> Pubs

**After they reply.** If he says the fixed schedule is wrong-for-experienced-drinkers, ask if a "freeform infusion #N" mode would be more honest. That's an actual product insight, not just outreach.

---

## Contact 5 — Tony Vincent

**Niche:** Classroom toolkit (EdTech)
**Pages to send:** `gotimer.org/classroom`, `gotimer.org/classroom/name-picker`, `gotimer.org/classroom/group-generator`

**Why him.** Tony has been doing EdTech newsletters and training for ~20 years. His audience is K-12 teachers who actively try new tools. He has a strict no-spam newsletter and is generous about featuring small builders — but only if you don't ask. Show genuine interest in *teachers*, not "newsletter slots."

**Contact.** tonyvincent.com → contact page. Also `@TonyVincent` on X if his email's slow.

**Subject:** A classroom-tools question from a parent-builder

**Body:**
> Hi Tony,
>
> I'm not a teacher, but I've been reading "Learning in Hand" newsletters for the last year because my kids' teachers cycle through classroom-tool apps that surface ads to Year 4s before the timer even starts. The week you wrote about evaluating tools against "would I be OK with my own kid using this" was the one that actually changed my filter.
>
> I built gotimer.org as a side project, and classroom tools became one of the bigger sections — partly because of what I'd seen at school pickup. The classroom hub is at gotimer.org/classroom: name picker, group generator, noise meter, tally counter. No signup, no ads on the tool pages.
>
> A question I'd love your view on: of the four tools, which one is actually *not* needed because teachers already have a good enough version, and which one is the one I should be polishing more? I'd rather kill a redundant tool than ship four mediocre ones.
>
> No newsletter ask — genuinely just want a parent-of-a-Year-4 honest gut check before I put more time in.
>
> Cheers,
> Pubs

**After they reply.** Do not ask for a newsletter slot in the second email either. If he says "the name picker is great, the noise meter is redundant," go fix it and reply with "you said X, I removed/improved Y." That's the third email at earliest before you ever ask for distribution.

---

## Contact 6 — Larry Ferlazzo

**Niche:** Classroom toolkit — listicle inclusion
**Pages to send:** `gotimer.org/classroom` (one URL only — don't paste five)

**Why him.** Larry runs one of the longest-standing classroom-tool resource blogs ("Larry Ferlazzo's Websites of the Day"). His "best of" lists rank for high-volume search terms and stay live for years. Inclusion in one of his refresh posts = months of organic traffic. He explicitly accepts builder submissions but is short on time, so the email needs to be one-question short. This is the most *transactional* of the contacts here — the others are relationship plays, this one is a polite ask.

**Contact.** larryferlazzo.edublogs.org → "Contact" link, or email listed on his Education Week author bio.

**Subject:** Submission for your next "best classroom timers" refresh

**Body:**
> Hi Larry,
>
> Your "Best Online Stopwatches & Timers" list from a couple of years back still ranks first for that search — it's where I went when I was looking for what teachers actually use.
>
> I built gotimer.org as a side project, and the classroom section grew into more than just a timer: name picker, group generator, noise meter, tally counter, all on one hub at gotimer.org/classroom. Two things that might make it different from the tools on your current list:
>
> 1. **No signup, no login, no email capture anywhere.** Class lists save to localStorage so a teacher can bookmark a URL with their own class baked in.
> 2. **The noise meter never records audio.** It reads the mic level locally and shows bouncy-balls or bars; the mic stream is discarded. Useful for the schools where any "audio uploaded somewhere" is a policy blocker.
>
> No expectation either way — happy to keep building regardless. If you have a minute, the hub is gotimer.org/classroom and the name picker specifically is gotimer.org/classroom/name-picker.
>
> Cheers,
> Pubs

**After they reply.** If he asks a clarifying question (e.g., "what's the data-retention policy?"), reply same day with a clear one-line answer. If he goes silent, follow up *once* after 10 days with the template at the bottom of this doc. Don't follow up twice.

---

## Contact 7 — Caleb Grove (tmtimer)

**Niche:** Debate / Toastmasters
**Pages to send:** `gotimer.org/productivity/debate-timer`, `gotimer.org/productivity/toastmasters-timer`

**Why him.** Caleb built tmtimer.com — a Toastmasters-focused timer with a small but loyal user base. He's a competitor on paper but also the most likely person to actually *appreciate* what you've built because he's solved the same problem and knows where the edges are. The right move here is collegial, not competitive: ask about the technical edges *he* hit. If it goes well, a cross-link from a fellow builder is more credible than a backlink from a content site.

**Contact.** tmtimer.com → about/contact page. Github profile likely linked too (he probably open-sourced parts of it). If neither works, try Toastmasters District Facebook groups — fellow builders tend to be visible there.

**Subject:** Hello from another timer-tool builder

**Body:**
> Hi Caleb,
>
> Discovered tmtimer when I was researching what existed in the speech-timing space — really clean implementation of the Toastmasters green/yellow/red signaling. The bit where you let the user calibrate the colour thresholds per speech type is something I hadn't seen anywhere else.
>
> Quick context on why I'm reaching out: I'm a tech guy and built gotimer.org as a side project — started generic, then kept adding niche timer modes when friends asked. Debate and Toastmasters were two of the niches that grew. There's a hub at gotimer.org/productivity/debate-timer with format presets for PF/LD/Policy/WSDC/Parli and a custom URL-encoded builder, plus a Toastmasters section at gotimer.org/productivity/toastmasters-timer with the four speech types.
>
> Two questions I'd love your view on, builder-to-builder:
>
> 1. If you were starting tmtimer over today, what's the feature you'd build first that you didn't?
> 2. Is there any obvious gap in the Toastmasters-tools landscape that you've explicitly *chosen* not to fill? I'd rather know before I accidentally duplicate something.
>
> No pitch, no ask — just genuinely curious what someone who's lived in this niche longer than I have would say.
>
> Cheers,
> Pubs

**After they reply.** If he's friendly: propose a mutual cross-link ("you for the niche depth, me for the format breadth — different rooms, same building"). Don't propose this in email one. If he's territorial, back off graciously and move on — the Toastmasters world is small and word travels.

---

## Contact 8 — EposVox

**Niche:** Streamer tools (BRB / starting-soon overlays)
**Pages to send:** `gotimer.org/brb`, `gotimer.org/brb/starting-soon`, `gotimer.org/brb/be-right-back`

**Why him.** EposVox is a streaming-software-education YouTuber (~400k subs). He covers OBS plugins, browser sources, and free streamer tools. A 30-second mention in one of his "free tools you might've missed" videos = thousands of permanent installs (each one = a future backlink via the embed). His threshold for mentioning a tool is: does it just work, no signup, no ads. You meet all three.

**Contact.** Business email on the EposVox YouTube About tab. Don't DM on Twitter for this one — his email is monitored, DMs aren't.

**Subject:** Free transparent BRB browser source — feedback request

**Body:**
> Hi Adam,
>
> Long-time viewer — your video on the OBS browser-source quirks (the GPU compositor one) saved me a week.
>
> I'm a tech guy and built gotimer.org as a side project. The BRB section was added recently because every "free BRB countdown" I found was either watermarked, signup-walled, or had a 10MB-download zip. So I built a transparent browser source you can configure via URL: `https://gotimer.org/brb?mins=5&label=Back+soon` works in OBS at 1920x1080 with no background. Presets at `/brb/starting-soon`, `/brb/be-right-back`, `/brb/stream-over`.
>
> No watermark, no signup, no attribution required.
>
> One question I'd love your gut take on: I haven't shipped a sound-cue option yet (e.g., a chime at 0:00) because I assume most streamers route alerts through a separate tool. Is that right, or is "just one URL that handles the countdown + a chime" actually something people would want?
>
> Not pitching for a feature — would just rather know before I build the wrong thing.
>
> Cheers,
> Pubs / gotimer.org

**After they reply.** If he's interested enough to look at the URL: ask if there's a tweak that would make it more usable for him personally. That's the second email's question. Don't ask for video coverage. If he likes it, he'll mention it.

---

## Contact 9 — Quinns Smith (Shut Up & Sit Down)

**Niche:** Board games — heavy / AP-prone games
**Pages to send:** `gotimer.org/board-games/multi-player-turn-timer/twilight-imperium`, `gotimer.org/board-games/multi-player-turn-timer`

**Why him.** Quinns is the most-followed English-language board-games critic. His audience plays the exact games (TI4, Gloomhaven, Brass) where a turn timer matters. SU&SD doesn't review tools, so don't pitch as a tool — pitch the *problem* (AP killing 8-hour games) and offer a useful URL as one possible response. Reply rate is low, but if Quinns finds it interesting his audience is huge and forum-active.

**Contact.** shutupandsitdown.com → contact form (mod team triages, then routes to Quinns/Matt/Pip). Alternative: Quinns on X (`@Quinns108`) — public DMs sometimes open.

**Subject:** A small tool for the TI4 / Gloomhaven AP problem

**Body:**
> Hi Quinns,
>
> SU&SD has been my "should I buy this?" filter for years — your Spirit Island review was the one that finally made me buy it.
>
> Quick context: I'm a tech guy and built gotimer.org as a side project. The board-games section started because a friend's TI4 group has one player who'd genuinely take 12 minutes per turn during the production phase, and we'd lose half a Saturday to it.
>
> So I built a multi-player turn timer that's a single shareable URL with player names + per-turn seconds baked in. You paste the URL into a group chat before game day, click "Next Turn" when your player passes, no install, no signup. Page is at gotimer.org/board-games/multi-player-turn-timer with presets for the usual suspects (TI4, Gloomhaven, Brass, Mage Knight, Through the Ages, Spirit Island).
>
> One question I'd love your view on: is "AP timer" actually a thing the heavy-board-games community wants, or is it considered rude to deploy one? I genuinely can't tell — half the people I ask think it'd save their group, the other half think it's the start of a divorce.
>
> No pitch for coverage — just curious what the culture is, because I'd rather build into the grain of it than against it.
>
> Cheers,
> Pubs / gotimer.org

**After they reply.** If he says it's culturally fine: ask whether SU&SD's forum has a place for "useful free tools" posts (be specific about not wanting front-page coverage). If he says it's culturally rude: ask which game would be the exception (probably TI4). Useful product signal either way.

---

## Contact 10 — Søberg Institute (CLOSED — 2026-05-20)

**Status:** Closed. The Institute replied to the initial courtesy email and asked that all uses of Susanna Søberg's name, the "Søberg protocol" label, and any implied endorsement be removed from the preset page and related references. The preset has been renamed to the **11-Minute Cold Protocol** (slug `/wellness/contrast-therapy/11-minute-cold-protocol`, with a 301 redirect from the old URL), and all in-copy references to Søberg, the Institute, and the "Søberg principle" have been replaced with neutral, descriptive language citing peer-reviewed cold-water immersion research generically.

**Lesson for future outreach.** Don't ship anything that hangs a named individual or institute on the page (or in URLs) without explicit prior permission. A descriptive name (a number, a method) is always safer than an eponymous name. SEO-wise, "11-Minute Cold Protocol" actually ranks for higher-volume queries than "Søberg protocol" did, so this was a net positive once forced.

**Do not re-contact.** The Institute was clear and gracious; respect that and move on.

---

## Permanent listings (not emails — different format)

These don't need a personal email. They're form submissions or community posts where the listing itself is the asset. Permanent backlinks; do these once and forget.

### A. OBS Project Resources

**URL:** obsproject.com/forum/resources → "Add Resource"
**Niche:** Streamer BRB + Embed widget
**Why it matters.** Permanent listing on the official OBS forum. Each install = a future backlink. Compounds for years.

**Listing title:** GoTimer BRB / Starting-Soon Browser Source — Free, No Signup
**Body:** Use the full template at `docs/plans/2026-05-17-outreach-email-templates.md:236-281` (Template 8). It's already drafted — just fill in your name and contact route.

**After submission.** Reply to the first user comment within 24h. That's the difference between a dead listing and one OBS surfaces. Don't bump it artificially.

---

### B. BGG geeklist

**URL:** boardgamegeek.com → "Geeklists" → "Create New Geeklist"
**Niche:** Board games (multi-player turn timer)
**Why it matters.** BGG geeklists rank in Google for "[game name] turn timer" and similar long-tails. They also surface to BGG's internal community for years.

**Geeklist title:** Free Web Turn Timer — for heavy clock games (no install, share URL)
**Intro + per-game items:** Use the template at `docs/plans/2026-05-17-outreach-email-templates.md:289-314` (Template 9). It already has the TI4 example written.

**Rule.** Tag at least 5 games. List fewer than 5 looks lazy and BGG won't surface it.

---

## When they don't reply — the one-shot follow-up

Send *once*, 7-10 days after the original. Never twice. Never with new asks.

**Subject:** Re: [original subject — exact same string]

> Hi [first name] — circling back in case the original got buried. No need to reply if it's not a fit; I'll assume you saw it and move on.
>
> [Two-line summary of the original ask]
>
> Cheers,
> Pubs

---

## Tracking — create `docs/outreach/contacts.csv` with this schema

```csv
contact_name,niche,channel,template_used,sent_date,reply_received,reply_date,outcome,notes
```

**Field values:**
- `template_used`: 1-10 matching the contact number in this doc
- `channel`: email / ig_dm / patreon / forum / contact_form
- `outcome`: featured / declined / no_reply / dead_lead / ongoing_dialog

Review weekly. The most useful insight after 2 months won't be reply rate — it'll be *which subject lines* got opened. If two of these get warm replies and three go silent, the pattern in the silent ones is the next thing to fix.

---

## What this doc deliberately doesn't include

- **20-20-20 eye-strain outreach.** Wait for impressions data first. The niche is too small to spend an outreach slot on before knowing it ranks.
- **Tea-side outreach beyond MeiLeaf.** TeaDB and Tea Drunk are listed in the original plan but are second-tier. Send MeiLeaf first, see what comes back, then decide.
- **Cold-emailing 10 named debate coaches.** It's in the original plan (`Template 4`) but high-volume cold sends to named individuals at schools is a different motion. Skip until/unless you want to dedicate an evening to it specifically — it doesn't fit the "one warm conversation per evening" pace of this doc.
- **Anything that asks for SEO, link exchanges, or sponsored mentions.** Filtered by every person on this list.

---

## If you only have 30 minutes tonight

Do **OBS Project Resources** (Permanent Listing A). It's a form, no reply chain, permanent listing, template already drafted. Highest compounding return per minute of any item on this page.

## If you have a quiet weekend

Do contacts **1, 2, 6, and Permanent Listing A**. That's: Glenn (sauna, relationship play), Lance (coffee, audience overlap), Larry (classroom, listicle inclusion), and OBS (permanent listing). Four very different channels, four different niches, four different evidence points after replies come in.
