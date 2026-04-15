/**
 * Unique SEO content for quick-timer pages (5-min, 10-min, etc.).
 * Each page has distinct intro_html, faq_json, and meta_description
 * with cross-links to related timers to avoid duplicate content penalties.
 *
 * These overrides are merged into timer page data at render time,
 * so no database migration is needed.
 */

interface QuickTimerContent {
  meta_description: string;
  intro_html: string;
  faq_json: string;
}

export const QUICK_TIMER_CONTENT: Record<string, QuickTimerContent> = {
  "5-minute-timer": {
    meta_description: "Start a free 5 minute countdown timer instantly. Perfect for micro-breaks, quick stretches, brewing tea, or short meditation sessions. No signup needed.",
    intro_html: `
      <h2>The 5 Minute Timer: Your Quick-Reset Tool</h2>
      <p>Five minutes is the sweet spot for micro-tasks that need a clear endpoint. Whether you're taking a <strong>quick break between meetings</strong>, doing a short breathing exercise, or timing a speed-clean of your desk, this timer keeps you honest about how long "just five minutes" really is.</p>
      <h3>What Can You Do in 5 Minutes?</h3>
      <ul>
        <li><strong>Brew the perfect cup of tea</strong> — most black teas steep for 3–5 minutes</li>
        <li><strong>Quick stretch or micro-workout</strong> — a few sets of pushups, a plank hold, or desk stretches. For a longer warm-up, try a <a href="/10-minute-timer">10 minute timer</a></li>
        <li><strong>Mental reset</strong> — a short guided breathing exercise to refocus. Our <a href="/wellness/breathing">breathing timer</a> is designed for this</li>
        <li><strong>Pomodoro break</strong> — the standard short break in the <a href="/pomodoro-timer">Pomodoro technique</a> is exactly 5 minutes</li>
        <li><strong>Timed journaling prompt</strong> — write without stopping for 5 minutes to get thoughts flowing</li>
      </ul>
      <h3>Why Use a Dedicated Timer?</h3>
      <p>Phone timers work, but they come with distractions. GoTimer runs in your browser with a <strong>fullscreen mode</strong> that blocks notifications and keeps the countdown front and center. Set an audio alert so you don't have to watch the clock — just focus on your task and let the timer tell you when time's up.</p>
    `,
    faq_json: JSON.stringify([
      { question: "How long is 5 minutes in seconds?", answer: "5 minutes is exactly 300 seconds. This timer starts at 5:00 and counts down to 0:00 with an audio alert when time is up." },
      { question: "What's a good 5 minute activity?", answer: 'Five minutes is ideal for tea steeping, quick stretches, breathing exercises, Pomodoro breaks, or speed-cleaning. For longer focused work, try a <a href="/25-minute-timer" class="text-secondary underline">25 minute timer</a> (a full Pomodoro session).' },
      { question: "Can I use this timer on my phone?", answer: "Yes — GoTimer works in any mobile browser with no app download needed. Tap the fullscreen button for a distraction-free experience." },
    ]),
  },

  "10-minute-timer": {
    meta_description: "Free 10 minute countdown timer for quick workouts, meditation, cleaning sprints, and timed journaling. Audio alert, fullscreen mode, no signup required.",
    intro_html: `
      <h2>10 Minutes: Enough Time to Make a Difference</h2>
      <p>Ten minutes is the threshold where short tasks become genuinely productive. Research shows that even <strong>10 minutes of exercise</strong> can boost mood and focus for hours afterward. This timer gives you a clear window to work with — no guessing, no clock-watching.</p>
      <h3>Popular 10-Minute Activities</h3>
      <ul>
        <li><strong>Morning meditation</strong> — a 10-minute sit is the most popular length for beginners. For guided breathing, try our <a href="/wellness/breathing">breathing timer</a></li>
        <li><strong>Quick HIIT workout</strong> — 10 rounds of 30s work / 30s rest fits perfectly. For structured intervals, use the <a href="/fitness/hiit">HIIT timer</a></li>
        <li><strong>Cleaning sprint</strong> — set the timer and clean one room as fast as you can</li>
        <li><strong>Warm-up or cool-down</strong> — a solid <a href="/fitness/stretching">stretching session</a> before or after a workout</li>
        <li><strong>Timed writing</strong> — write without editing for 10 minutes to overcome writer's block</li>
      </ul>
      <h3>The "Just 10 Minutes" Trick</h3>
      <p>Struggling to start a task? Commit to <em>just 10 minutes</em>. It's short enough to feel easy, but once you start, momentum usually carries you further. If it doesn't, you've still done 10 minutes more than zero. Need a longer session? Try a <a href="/15-minute-timer">15 minute timer</a> or go all-in with a <a href="/25-minute-timer">25-minute Pomodoro</a>.</p>
    `,
    faq_json: JSON.stringify([
      { question: "How many seconds is 10 minutes?", answer: "10 minutes equals 600 seconds. The timer counts down from 10:00 with beeps in the final 10 seconds and a louder alert at zero." },
      { question: "Is 10 minutes enough for meditation?", answer: 'Yes — 10 minutes is the most popular meditation length for both beginners and experienced practitioners. Studies show consistent 10-minute sessions reduce stress as effectively as longer ones. Try our dedicated <a href="/meditation-timer" class="text-secondary underline">meditation timer</a> for a calmer interface.' },
      { question: "What workout can I do in 10 minutes?", answer: 'A 10-minute HIIT circuit (30s on, 30s off for 10 rounds) is highly effective. You can also do a focused <a href="/fitness/tabata" class="text-secondary underline">Tabata session</a> (4 minutes of intense intervals) with a 6-minute warm-up and cool-down.' },
    ]),
  },

  "15-minute-timer": {
    meta_description: "Free 15 minute countdown timer for focused work blocks, classroom activities, coffee breaks, and short cooking tasks. Works on any device, no signup.",
    intro_html: `
      <h2>15 Minutes: The Power Quarter-Hour</h2>
      <p>Fifteen minutes strikes the balance between "quick break" and "serious session." It's long enough to accomplish a meaningful chunk of work, but short enough to maintain urgency. Time management experts call it the <strong>"power quarter-hour"</strong> — the minimum length for a truly productive work sprint.</p>
      <h3>Ideal Uses for a 15-Minute Timer</h3>
      <ul>
        <li><strong>Classroom activities</strong> — group work, quizzes, or reading time. Teachers love the <a href="/classroom-timer">classroom timer</a> for its large fullscreen display</li>
        <li><strong>Coffee break</strong> — enough time to make and enjoy a coffee without losing the rest of your morning</li>
        <li><strong>Short cooking tasks</strong> — sautéing vegetables, reducing a sauce, or resting dough. See all our <a href="/kitchen">kitchen timers</a></li>
        <li><strong>Inbox triage</strong> — process emails in a 15-minute block instead of letting them eat your day</li>
        <li><strong>Warm-up before focused work</strong> — clear your desk, close tabs, review your task list, then start a <a href="/25-minute-timer">25-minute focus session</a></li>
      </ul>
      <h3>The 15-Minute Rule for Procrastination</h3>
      <p>When a task feels overwhelming, tell yourself you only have to work on it for 15 minutes. This technique lowers the mental barrier to starting. Once the timer is running, you'll often continue past the alarm. If not, you've still made progress. For even shorter motivation kicks, try a <a href="/5-minute-timer">5-minute timer</a> or a <a href="/10-minute-timer">10-minute timer</a>.</p>
    `,
    faq_json: JSON.stringify([
      { question: "How long is 15 minutes in seconds?", answer: "15 minutes is 900 seconds. This timer starts at 15:00 and counts down with audio alerts." },
      { question: "What can I accomplish in 15 minutes?", answer: 'Quite a lot: a classroom activity, email triage, a cooking task, a focused writing sprint, or a proper coffee break. For longer focused work, try a <a href="/25-minute-timer" class="text-secondary underline">25 minute Pomodoro session</a>.' },
      { question: "Is 15 minutes a good study block?", answer: 'For most students, 15 minutes is too short for deep study but great for review and flashcards. The <a href="/pomodoro-timer" class="text-secondary underline">Pomodoro method</a> recommends 25-minute blocks for deep work. However, for ADHD or when motivation is low, 15 minutes is an excellent starting point.' },
    ]),
  },

  "20-minute-timer": {
    meta_description: "Free 20 minute countdown timer ideal for power naps, yoga sessions, HIIT workouts, and focused study. Audio alerts, fullscreen, no account needed.",
    intro_html: `
      <h2>20 Minutes: The Science-Backed Sweet Spot</h2>
      <p>Twenty minutes comes up again and again in research as an optimal duration. NASA found that <strong>20-minute power naps</strong> improve alertness by 54% and performance by 34%. Exercise scientists recommend at least 20 minutes of cardio for cardiovascular benefits. And most yoga classes include a 20-minute flow option for time-crunched practitioners.</p>
      <h3>What's Special About 20 Minutes?</h3>
      <ul>
        <li><strong>Power nap</strong> — 20 minutes is the ideal nap length to wake refreshed without entering deep sleep</li>
        <li><strong>HIIT or circuit training</strong> — a complete <a href="/fitness/hiit">HIIT session</a> with warm-up and cool-down. For pure Tabata, try the <a href="/fitness/tabata">Tabata timer</a></li>
        <li><strong>Yoga flow</strong> — enough time for a sun salutation sequence and a few standing poses. For meditation at the end, add a <a href="/meditation-timer">meditation timer</a></li>
        <li><strong>Rice and pasta</strong> — most grains cook in 15–20 minutes. Check our <a href="/kitchen/cooking">cooking timer</a> for kitchen presets</li>
        <li><strong>Board game turns</strong> — set a 20-minute limit per round in longer strategy games. See our <a href="/board-games">board game timers</a></li>
      </ul>
      <h3>Pairing 20-Minute Blocks</h3>
      <p>Stack two 20-minute blocks with a <a href="/5-minute-timer">5-minute break</a> between them for a modified Pomodoro rhythm that works well for creative tasks where 25 minutes feels too rigid. For the standard approach, use the <a href="/pomodoro-timer">Pomodoro timer</a>.</p>
    `,
    faq_json: JSON.stringify([
      { question: "How many seconds is 20 minutes?", answer: "20 minutes is 1,200 seconds. This timer counts down from 20:00 with audio alerts when time expires." },
      { question: "Is 20 minutes enough for a workout?", answer: 'Absolutely. A 20-minute HIIT session burns comparable calories to 40 minutes of moderate exercise. Use our <a href="/fitness/hiit" class="text-secondary underline">HIIT timer</a> for structured intervals, or this countdown for free-form workouts.' },
      { question: "How long should a power nap be?", answer: "NASA research shows 20 minutes is ideal — long enough to boost alertness and performance, short enough to avoid sleep inertia (that groggy feeling from waking during deep sleep). Set this timer and close your eyes." },
    ]),
  },

  "25-minute-timer": {
    meta_description: "Free 25 minute timer — the classic Pomodoro work interval. Stay focused with audio alerts, fullscreen mode, and zero distractions. No signup needed.",
    intro_html: `
      <h2>25 Minutes: The Pomodoro Standard</h2>
      <p>The 25-minute work interval is the foundation of the <strong>Pomodoro Technique</strong>, developed by Francesco Cirillo in the late 1980s. He chose 25 minutes because it's long enough for meaningful deep work, but short enough to maintain consistent focus without mental fatigue. Decades later, it remains the most popular timed work method worldwide.</p>
      <h3>How to Use the Pomodoro Method</h3>
      <ol>
        <li>Choose a single task to focus on</li>
        <li>Start this 25-minute timer and work without interruption</li>
        <li>When the alarm sounds, take a <a href="/5-minute-timer">5-minute break</a></li>
        <li>After four sessions, take a longer 15–30 minute break (use a <a href="/15-minute-timer">15 min</a> or <a href="/30-minute-timer">30 min timer</a>)</li>
      </ol>
      <p>For automated Pomodoro cycles with built-in breaks, use our dedicated <a href="/pomodoro-timer">Pomodoro timer</a> which handles the work/break rotation automatically.</p>
      <h3>Why 25 Minutes Works</h3>
      <ul>
        <li><strong>Reduces decision fatigue</strong> — you don't have to decide when to stop, the timer decides for you</li>
        <li><strong>Creates urgency</strong> — a visible countdown motivates you to stay on task</li>
        <li><strong>Prevents burnout</strong> — mandatory breaks keep you fresher throughout the day</li>
        <li><strong>Tracks progress</strong> — counting completed "pomodoros" gives you a concrete measure of productive time</li>
      </ul>
      <p>If 25 minutes feels too long for your current focus level, start with a <a href="/15-minute-timer">15 minute timer</a> or try an <a href="/adhd-focus-timer">ADHD focus timer</a> designed for shorter intervals.</p>
    `,
    faq_json: JSON.stringify([
      { question: "Why is a Pomodoro session 25 minutes?", answer: 'Francesco Cirillo tested various durations and found 25 minutes was the optimal balance between deep focus and mental sustainability. It\'s long enough to make real progress but short enough to maintain concentration. Use our <a href="/pomodoro-timer" class="text-secondary underline">Pomodoro timer</a> for automated work/break cycles.' },
      { question: "What should I do during the 5-minute break?", answer: 'Stand up, stretch, get water, look away from your screen. Avoid checking social media or email — those activities make it harder to refocus. Use a <a href="/5-minute-timer" class="text-secondary underline">5 minute timer</a> so your break doesn\'t stretch into 15 minutes.' },
      { question: "Is 25 minutes too long for ADHD?", answer: 'It can be. If 25 minutes feels overwhelming, try our <a href="/adhd-focus-timer" class="text-secondary underline">ADHD focus timer</a> set to 15 minutes, or start with a <a href="/10-minute-timer" class="text-secondary underline">10 minute timer</a> and work up gradually.' },
    ]),
  },

  "30-minute-timer": {
    meta_description: "Free 30 minute countdown timer for meetings, workouts, study sessions, and cooking. Large display, audio alerts, fullscreen mode. No sign-up required.",
    intro_html: `
      <h2>30 Minutes: The Half-Hour Block</h2>
      <p>Thirty minutes is the natural unit of scheduling — meetings, TV shows, gym sessions, and class periods are all built around it. A <strong>30-minute block</strong> is long enough for a substantial task but fits neatly into any calendar. This timer keeps your half-hour honest.</p>
      <h3>Popular Uses for a 30-Minute Timer</h3>
      <ul>
        <li><strong>Meeting timekeeper</strong> — keep stand-ups and 1:1s on schedule. Use fullscreen mode and position your screen where everyone can see it</li>
        <li><strong>Full workout session</strong> — a complete <a href="/fitness/hiit">HIIT circuit</a> or strength routine with rest periods. For structured intervals, use our <a href="/fitness/emom">EMOM timer</a></li>
        <li><strong>Extended study block</strong> — slightly longer than a Pomodoro for subjects that need deeper immersion. Follow with a <a href="/10-minute-timer">10-minute break</a></li>
        <li><strong>Bread proofing or marinating</strong> — many recipes call for 30 minutes of resting time. See our <a href="/kitchen/bread-proofing">bread proofing timer</a> for longer rises</li>
        <li><strong>Presentation rehearsal</strong> — practice a conference talk with a visible countdown. Try our <a href="/presentation-timer">presentation timer</a> for more features</li>
      </ul>
      <h3>30 Minutes vs. 25 Minutes</h3>
      <p>If you follow the Pomodoro Technique, you might wonder why not just use a <a href="/25-minute-timer">25-minute timer</a>. The answer: Pomodoro is designed for deep-focus single-tasking. A 30-minute timer works better for tasks with natural stopping points — meetings that end when they end, workouts with variable rest times, or cooking where you need to check on food at the 30-minute mark.</p>
    `,
    faq_json: JSON.stringify([
      { question: "How many seconds is 30 minutes?", answer: "30 minutes equals 1,800 seconds. This timer provides audio alerts in the final 10 seconds and a louder alert when it reaches zero." },
      { question: "What's a good 30-minute workout?", answer: 'A 30-minute HIIT session, circuit training, or jog is highly effective. Try our <a href="/fitness/hiit" class="text-secondary underline">HIIT timer</a> for interval-based workouts, or the <a href="/fitness/tabata" class="text-secondary underline">Tabata timer</a> for an intense 4-minute finisher at the end.' },
      { question: "Can I use this for a meeting?", answer: "Yes — tap the fullscreen button for a large, visible countdown that the whole room can see. The audio alert signals when time is up so discussions stay on track." },
    ]),
  },

  "45-minute-timer": {
    meta_description: "Free 45 minute countdown timer for class periods, deep work sessions, therapy appointments, and long cooking tasks. Fullscreen, audio alert, no signup.",
    intro_html: `
      <h2>45 Minutes: The Standard Class Period</h2>
      <p>Forty-five minutes is the standard length for school class periods, therapy sessions, and many structured learning activities. It's rooted in attention research: most adults can sustain <strong>focused attention for 45–50 minutes</strong> before needing a break. This timer is built for those longer, structured sessions.</p>
      <h3>When to Use a 45-Minute Timer</h3>
      <ul>
        <li><strong>Classroom activities</strong> — time a full class period with a visible countdown. For a dedicated teaching tool, try the <a href="/classroom-timer">classroom timer</a></li>
        <li><strong>Deep work session</strong> — longer than a <a href="/25-minute-timer">Pomodoro</a> for tasks that need extended immersion, like writing, coding, or research</li>
        <li><strong>Therapy or coaching sessions</strong> — many practitioners use 45-minute sessions rather than a full hour</li>
        <li><strong>Slow-cooking checkpoints</strong> — stews, braises, and roasts often need a 45-minute check. For multi-dish timing, try the <a href="/kitchen/multi-timer">multi-timer</a></li>
        <li><strong>Film development</strong> — some stand development processes run 30–60 minutes. Our <a href="/photography/stand-development">stand development timer</a> handles these with temperature reminders</li>
      </ul>
      <h3>Managing Energy in Longer Sessions</h3>
      <p>At 45 minutes, fatigue is real. If you're studying or doing desk work, follow each 45-minute block with a <a href="/15-minute-timer">15-minute break</a> — enough to walk around, hydrate, and reset before the next session. This 45/15 rhythm (also called the "class period method") works well for people who find 25-minute Pomodoros too choppy for their workflow.</p>
    `,
    faq_json: JSON.stringify([
      { question: "How many seconds is 45 minutes?", answer: "45 minutes is 2,700 seconds. The timer counts down from 45:00 with an audio alert when time expires." },
      { question: "Is 45 minutes better than 25 minutes for studying?", answer: 'It depends on the subject. For deep reading, writing, or problem-solving, 45 minutes allows you to fully enter a flow state. For subjects that need frequent review, the <a href="/pomodoro-timer" class="text-secondary underline">Pomodoro method</a> (25 min work + 5 min break) may be more effective. Experiment with both.' },
      { question: "Can teachers use this in a classroom?", answer: 'Yes — tap fullscreen for a large, visible countdown. For more classroom features like activity labels and large-format display, try our dedicated <a href="/classroom-timer" class="text-secondary underline">classroom timer</a>.' },
    ]),
  },

  "60-minute-timer": {
    meta_description: "Free 60 minute (1 hour) countdown timer for long meetings, deep work, baking, and extended focus sessions. Audio alerts, fullscreen, no sign-up.",
    intro_html: `
      <h2>60 Minutes: The Full Hour</h2>
      <p>One hour is a significant commitment of focused time. Whether it's a <strong>board meeting, a baking recipe, or a deep work marathon</strong>, a visible 60-minute countdown adds structure and accountability to your session. This timer displays in HH:MM:SS format so you can track exactly where you are in the hour.</p>
      <h3>What Fits into 60 Minutes?</h3>
      <ul>
        <li><strong>Board meetings and all-hands</strong> — keep hourly meetings on track. The fullscreen display works as a room timer on a shared screen</li>
        <li><strong>Baking</strong> — cakes, bread, and casseroles commonly bake for 45–60 minutes. For multi-dish coordination, use the <a href="/kitchen/multi-timer">multi-timer</a></li>
        <li><strong>Extended deep work</strong> — for those who find <a href="/25-minute-timer">25-minute Pomodoros</a> too short. Follow with a <a href="/15-minute-timer">15-minute break</a></li>
        <li><strong>Board game rounds</strong> — set a 1-hour limit on strategy games like Terraforming Mars. For per-player time limits, use the <a href="/chess-clock-setup">chess clock</a></li>
        <li><strong>Film development</strong> — C-41 color process and some stand development methods run close to an hour. Our <a href="/photography/film-development">film development timer</a> includes process-specific steps</li>
        <li><strong>Exam practice</strong> — simulate timed exam conditions. For study sessions with breaks, try the <a href="/study-timer">study timer</a></li>
      </ul>
      <h3>Breaking Up the Hour</h3>
      <p>If a full hour feels daunting, split it into two <a href="/30-minute-timer">30-minute blocks</a> or three <a href="/20-minute-timer">20-minute blocks</a> with short breaks. The key is matching the timer length to your attention span — there's no shame in using shorter intervals and working up to a full hour.</p>
    `,
    faq_json: JSON.stringify([
      { question: "How many seconds is 60 minutes?", answer: "60 minutes (1 hour) is 3,600 seconds. The timer displays in HH:MM:SS format and provides audio alerts when complete." },
      { question: "How do I stay focused for a full hour?", answer: 'Start by removing distractions — use fullscreen mode to hide everything else. If an hour is too long, try building up: start with <a href="/25-minute-timer" class="text-secondary underline">25 minutes</a>, then <a href="/45-minute-timer" class="text-secondary underline">45 minutes</a>, then a full hour. Hydrate and take a 15-minute break afterward.' },
      { question: "Can I use this for baking?", answer: 'Yes — this timer works well for recipes that need 60 minutes of oven time. For managing multiple dishes with different cook times, try the <a href="/kitchen/multi-timer" class="text-secondary underline">multi-timer</a> which runs several countdowns at once.' },
    ]),
  },
};
