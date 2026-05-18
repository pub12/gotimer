/**
 * Debate format shim.
 *
 * Five competitive debate formats (Public Forum, Lincoln-Douglas, Policy,
 * World Schools, British Parliamentary) expressed as multi-step phase
 * sequences. The structure mirrors src/lib/tea-presets.ts and
 * src/lib/contrast-therapy.ts — strategies stay agnostic of the niche while
 * each format-specific URL declares its data once.
 *
 * Speech times follow NSDA (US) and WSDC/BP (international) published
 * guidance as of 2024. They are starting points; tournament invitations
 * occasionally adjust them and the custom builder is the escape hatch.
 */
import type { StepDefinition } from "@/lib/timer-strategies/multi-step";

export interface SpeechTimesRow {
  /** Order column ("1", "2", ...) — used as React key */
  position: string;
  /** Phase or speech name */
  name: string;
  /** Duration text ("4:00", "3:00") */
  duration: string;
  /** Optional notes ("First constructive", "POIs allowed 1:00-7:00") */
  notes?: string;
}

export interface DebateFormat {
  /** URL slug (e.g., "public-forum") */
  slug: string;
  /** Display name */
  name: string;
  /** League / governing body */
  league: string;
  /** Short summary string (e.g., "4-4-3-4-4-3-3-3-3-2-2 minutes") */
  summary: string;
  /** Steps consumed by the multi-step strategy */
  steps: StepDefinition[];
  /** Total round time in minutes (excludes prep time) */
  total_minutes: number;
  /** Reference table for the SEO content area */
  speech_times: SpeechTimesRow[];
  /** Default prep time per team in seconds (separate countdown — informational) */
  prep_seconds: number;
  /** Whether POIs / heckling are part of the format */
  poi_supported: boolean;
  /** Optional POI window inside each constructive speech ("minute 1 to minute 7") */
  poi_window?: string;
  /** Headline FAQ-table key facts for the hero card */
  tagline: string;
}

// ---------------------------------------------------------------------------
// Public Forum (NSDA)
// ---------------------------------------------------------------------------

export const PUBLIC_FORUM: DebateFormat = {
  slug: "public-forum",
  name: "Public Forum",
  league: "NSDA / National Speech & Debate Association",
  summary: "4-4-3-4-4-3-3-3-3-2-2 minutes",
  total_minutes: 35,
  prep_seconds: 180,
  poi_supported: false,
  tagline: "Two-on-two team debate, three crossfires, 35-minute round",
  steps: [
    { name: "1st Constructive — Team A", duration: 4 * 60 },
    { name: "1st Constructive — Team B", duration: 4 * 60 },
    { name: "Crossfire — 1st speakers", duration: 3 * 60 },
    { name: "Rebuttal — Team A", duration: 4 * 60 },
    { name: "Rebuttal — Team B", duration: 4 * 60 },
    { name: "Crossfire — 2nd speakers", duration: 3 * 60 },
    { name: "Summary — Team A", duration: 3 * 60 },
    { name: "Summary — Team B", duration: 3 * 60 },
    { name: "Grand Crossfire", duration: 3 * 60 },
    { name: "Final Focus — Team A", duration: 2 * 60 },
    { name: "Final Focus — Team B", duration: 2 * 60 },
  ],
  speech_times: [
    { position: "1", name: "1st Constructive — Team A", duration: "4:00", notes: "Reads case (Pro side)" },
    { position: "2", name: "1st Constructive — Team B", duration: "4:00", notes: "Reads case (Con side)" },
    { position: "3", name: "Crossfire (1st speakers)", duration: "3:00", notes: "Both 1st speakers, alternating questions" },
    { position: "4", name: "Rebuttal — Team A", duration: "4:00", notes: "Refutes Team B&apos;s case" },
    { position: "5", name: "Rebuttal — Team B", duration: "4:00", notes: "Refutes Team A&apos;s case + frontline" },
    { position: "6", name: "Crossfire (2nd speakers)", duration: "3:00", notes: "Both 2nd speakers" },
    { position: "7", name: "Summary — Team A", duration: "3:00", notes: "1st speaker, key voters" },
    { position: "8", name: "Summary — Team B", duration: "3:00", notes: "1st speaker, key voters" },
    { position: "9", name: "Grand Crossfire", duration: "3:00", notes: "All 4 debaters" },
    { position: "10", name: "Final Focus — Team A", duration: "2:00", notes: "2nd speaker, world-of-the-ballot" },
    { position: "11", name: "Final Focus — Team B", duration: "2:00", notes: "2nd speaker, world-of-the-ballot" },
  ],
};

// ---------------------------------------------------------------------------
// Lincoln-Douglas (NSDA)
// ---------------------------------------------------------------------------

export const LINCOLN_DOUGLAS: DebateFormat = {
  slug: "lincoln-douglas",
  name: "Lincoln-Douglas",
  league: "NSDA / National Speech & Debate Association",
  summary: "6-3-7-3-4-6-3 minutes (with cross-examination)",
  total_minutes: 32,
  prep_seconds: 240,
  poi_supported: false,
  tagline: "One-on-one value debate, two cross-examinations, 32-minute round",
  steps: [
    { name: "Affirmative Constructive (AC)", duration: 6 * 60 },
    { name: "Cross-Examination — Neg questions Aff", duration: 3 * 60 },
    { name: "Negative Constructive (NC)", duration: 7 * 60 },
    { name: "Cross-Examination — Aff questions Neg", duration: 3 * 60 },
    { name: "1st Affirmative Rebuttal (1AR)", duration: 4 * 60 },
    { name: "Negative Rebuttal (NR)", duration: 6 * 60 },
    { name: "2nd Affirmative Rebuttal (2AR)", duration: 3 * 60 },
  ],
  speech_times: [
    { position: "1", name: "Affirmative Constructive (AC)", duration: "6:00", notes: "Reads aff case" },
    { position: "2", name: "Cross-X (Neg → Aff)", duration: "3:00" },
    { position: "3", name: "Negative Constructive (NC)", duration: "7:00", notes: "Reads neg case + answers aff" },
    { position: "4", name: "Cross-X (Aff → Neg)", duration: "3:00" },
    { position: "5", name: "1st Affirmative Rebuttal (1AR)", duration: "4:00", notes: "Hardest speech in LD — covers all of NC" },
    { position: "6", name: "Negative Rebuttal (NR)", duration: "6:00", notes: "Crystallises neg position" },
    { position: "7", name: "2nd Affirmative Rebuttal (2AR)", duration: "3:00", notes: "Final aff speech" },
  ],
};

// ---------------------------------------------------------------------------
// Policy (NSDA Cross-Examination Debate)
// ---------------------------------------------------------------------------

export const POLICY: DebateFormat = {
  slug: "policy",
  name: "Policy",
  league: "NSDA / NDT-CEDA cross-examination format",
  summary: "8-3-8-3-8-3-8-3-5-5-5-5 minutes (CX rebuttals)",
  total_minutes: 64,
  prep_seconds: 480,
  poi_supported: false,
  tagline: "Two-on-two evidence-heavy policy debate, four CX periods, 8-min prep per side",
  steps: [
    { name: "1st Affirmative Constructive (1AC)", duration: 8 * 60 },
    { name: "Cross-X — Neg questions Aff", duration: 3 * 60 },
    { name: "1st Negative Constructive (1NC)", duration: 8 * 60 },
    { name: "Cross-X — Aff questions Neg", duration: 3 * 60 },
    { name: "2nd Affirmative Constructive (2AC)", duration: 8 * 60 },
    { name: "Cross-X — Neg questions Aff", duration: 3 * 60 },
    { name: "2nd Negative Constructive (2NC)", duration: 8 * 60 },
    { name: "Cross-X — Aff questions Neg", duration: 3 * 60 },
    { name: "1st Negative Rebuttal (1NR)", duration: 5 * 60 },
    { name: "1st Affirmative Rebuttal (1AR)", duration: 5 * 60 },
    { name: "2nd Negative Rebuttal (2NR)", duration: 5 * 60 },
    { name: "2nd Affirmative Rebuttal (2AR)", duration: 5 * 60 },
  ],
  speech_times: [
    { position: "1", name: "1AC", duration: "8:00", notes: "Reads case" },
    { position: "2", name: "Cross-X (Neg → 1A)", duration: "3:00" },
    { position: "3", name: "1NC", duration: "8:00", notes: "Disads, kritiks, T, case attacks" },
    { position: "4", name: "Cross-X (Aff → 1N)", duration: "3:00" },
    { position: "5", name: "2AC", duration: "8:00", notes: "Answers 1NC + extends case" },
    { position: "6", name: "Cross-X (Neg → 2A)", duration: "3:00" },
    { position: "7", name: "2NC", duration: "8:00", notes: "Splits the block with 1NR" },
    { position: "8", name: "Cross-X (Aff → 2N)", duration: "3:00" },
    { position: "9", name: "1NR", duration: "5:00", notes: "Second half of the neg block" },
    { position: "10", name: "1AR", duration: "5:00", notes: "Hardest speech — answers 13 minutes of neg" },
    { position: "11", name: "2NR", duration: "5:00", notes: "Picks neg&apos;s strongest world" },
    { position: "12", name: "2AR", duration: "5:00", notes: "Final aff speech" },
  ],
};

// ---------------------------------------------------------------------------
// World Schools Debate Championship (WSDC)
// ---------------------------------------------------------------------------

export const WSDC: DebateFormat = {
  slug: "wsdc",
  name: "World Schools",
  league: "WSDC / World Schools Debating Championships",
  summary: "8-8-8-8-8-8-4-4 minutes (POIs minute 1-7)",
  total_minutes: 56,
  prep_seconds: 60 * 60,
  poi_supported: true,
  poi_window: "minute 1:00 to 7:00",
  tagline: "International 3-on-3 format with Points of Information during constructives",
  steps: [
    { name: "1st Proposition", duration: 8 * 60 },
    { name: "1st Opposition", duration: 8 * 60 },
    { name: "2nd Proposition", duration: 8 * 60 },
    { name: "2nd Opposition", duration: 8 * 60 },
    { name: "3rd Proposition", duration: 8 * 60 },
    { name: "3rd Opposition", duration: 8 * 60 },
    { name: "Opposition Reply", duration: 4 * 60 },
    { name: "Proposition Reply", duration: 4 * 60 },
  ],
  speech_times: [
    { position: "1", name: "1st Proposition", duration: "8:00", notes: "Defines motion, sets framework" },
    { position: "2", name: "1st Opposition", duration: "8:00", notes: "Engages framework, opens opp case" },
    { position: "3", name: "2nd Proposition", duration: "8:00", notes: "Extends prop, rebuts 1st opp" },
    { position: "4", name: "2nd Opposition", duration: "8:00", notes: "Extends opp, rebuts 2nd prop" },
    { position: "5", name: "3rd Proposition", duration: "8:00", notes: "Rebuttal-only — no new arguments" },
    { position: "6", name: "3rd Opposition", duration: "8:00", notes: "Rebuttal-only — no new arguments" },
    { position: "7", name: "Opposition Reply", duration: "4:00", notes: "Given by 1st or 2nd opp" },
    { position: "8", name: "Proposition Reply", duration: "4:00", notes: "Given by 1st or 2nd prop" },
  ],
};

// ---------------------------------------------------------------------------
// British Parliamentary (BP)
// ---------------------------------------------------------------------------

export const BRITISH_PARLIAMENTARY: DebateFormat = {
  slug: "british-parliamentary",
  name: "British Parliamentary",
  league: "WUDC / World Universities Debating Championships",
  summary: "8 × 7-minute speeches (POIs minute 1-6)",
  total_minutes: 56,
  prep_seconds: 15 * 60,
  poi_supported: true,
  poi_window: "minute 1:00 to 6:00",
  tagline: "Four-team university format — Opening Govt, Opening Opp, Closing Govt, Closing Opp",
  steps: [
    { name: "Prime Minister (Opening Govt)", duration: 7 * 60 },
    { name: "Leader of Opposition (Opening Opp)", duration: 7 * 60 },
    { name: "Deputy Prime Minister (Opening Govt)", duration: 7 * 60 },
    { name: "Deputy Leader of Opp (Opening Opp)", duration: 7 * 60 },
    { name: "Member of Government (Closing Govt)", duration: 7 * 60 },
    { name: "Member of Opposition (Closing Opp)", duration: 7 * 60 },
    { name: "Government Whip (Closing Govt)", duration: 7 * 60 },
    { name: "Opposition Whip (Closing Opp)", duration: 7 * 60 },
  ],
  speech_times: [
    { position: "1", name: "Prime Minister (PM)", duration: "7:00", notes: "Opening Govt — defines motion" },
    { position: "2", name: "Leader of Opposition (LO)", duration: "7:00", notes: "Opening Opp — engages" },
    { position: "3", name: "Deputy Prime Minister (DPM)", duration: "7:00", notes: "Opening Govt — extension" },
    { position: "4", name: "Deputy Leader of Opp (DLO)", duration: "7:00", notes: "Opening Opp — extension" },
    { position: "5", name: "Member of Government (MG)", duration: "7:00", notes: "Closing Govt — new extension" },
    { position: "6", name: "Member of Opposition (MO)", duration: "7:00", notes: "Closing Opp — new extension" },
    { position: "7", name: "Government Whip (GW)", duration: "7:00", notes: "Closing Govt — sums up — no new args" },
    { position: "8", name: "Opposition Whip (OW)", duration: "7:00", notes: "Closing Opp — sums up — no new args" },
  ],
};

// ---------------------------------------------------------------------------
// Registry
// ---------------------------------------------------------------------------

export const DEBATE_FORMATS: Record<string, DebateFormat> = {
  "public-forum": PUBLIC_FORUM,
  "lincoln-douglas": LINCOLN_DOUGLAS,
  policy: POLICY,
  wsdc: WSDC,
  "british-parliamentary": BRITISH_PARLIAMENTARY,
};

export const DEFAULT_DEBATE_FORMAT: DebateFormat = PUBLIC_FORUM;

export const DEBATE_FORMAT_ORDER: string[] = [
  "public-forum",
  "lincoln-douglas",
  "policy",
  "wsdc",
  "british-parliamentary",
];
