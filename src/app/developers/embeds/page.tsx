import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { STRATEGIES } from "@/lib/timer-registry";

export function generateMetadata(): Metadata {
  return {
    title: "Embed Widgets — GoTimer Developer Docs",
    description:
      "Add free countdown timers, chess clocks, Pomodoro timers, and interval timers to your website with a simple embed code. Customizable themes, sizes, and controls.",
    openGraph: {
      title: "GoTimer Embeddable Widgets",
      description:
        "Free embeddable timer widgets for any website. Countdown, chess clock, Pomodoro, and interval timers.",
      url: "https://gotimer.org/developers/embeds",
      type: "website",
    },
  };
}

export default function EmbedsPage() {
  return (
    <main className="min-h-screen flex flex-col items-center bg-gray-50 p-4 pt-20">
      <Navbar />
      <div className="w-full max-w-3xl mx-auto">
        {/* Hero / Intro */}
        <h1 className="text-3xl font-bold mb-2">Embed GoTimer Widgets</h1>
        <p className="text-gray-600 mb-8 text-lg">
          Add free, customizable timer widgets to any website in seconds.
        </p>

        {/* Quick Start */}
        <div className="bg-white rounded-xl p-5 shadow-sm border mb-6">
          <h2 className="text-xl font-semibold mb-2">Quick Start</h2>
          <p className="text-gray-600 mb-3">
            Paste this into your HTML and you have a 5-minute countdown timer. That&apos;s it.
          </p>
          <pre className="bg-gray-900 text-green-400 rounded-lg p-4 text-sm overflow-x-auto font-mono">
            {`<iframe src="https://gotimer.org/embed/countdown?duration=300"
  width="480" height="400" frameborder="0"
  allow="autoplay" loading="lazy"
  style="border-radius: 8px;"></iframe>`}
          </pre>
        </div>

        {/* Timer Types */}
        <div className="bg-white rounded-xl p-5 shadow-sm border mb-6">
          <h2 className="text-xl font-semibold mb-4">Timer Types</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 pr-4 font-semibold text-gray-800">Type</th>
                  <th className="text-left py-2 pr-4 font-semibold text-gray-800">Embed URL</th>
                  <th className="text-left py-2 font-semibold text-gray-800">Key Parameters</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                {Object.values(STRATEGIES).map((s, i, arr) => (
                  <tr key={s.id} className={i < arr.length - 1 ? "border-b" : ""}>
                    <td className="py-2 pr-4">{s.name}</td>
                    <td className="py-2 pr-4">
                      <code className="text-xs bg-gray-100 px-1 rounded">/embed{s.route}</code>
                    </td>
                    <td className="py-2">
                      {s.supportedParams.map((p, j) => (
                        <span key={p}>
                          {j > 0 && ", "}
                          <code className="text-xs bg-gray-100 px-1 rounded">{p}</code>
                        </span>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Parameters Reference */}
        <div className="bg-white rounded-xl p-5 shadow-sm border mb-6">
          <h2 className="text-xl font-semibold mb-4">Parameters Reference</h2>
          <p className="text-gray-600 mb-3">
            All parameters are passed as URL query strings. For example:{" "}
            <code className="text-xs bg-gray-100 px-1 rounded">
              /embed/countdown?duration=600&theme=dark
            </code>
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 pr-4 font-semibold text-gray-800">Parameter</th>
                  <th className="text-left py-2 pr-4 font-semibold text-gray-800">Type</th>
                  <th className="text-left py-2 pr-4 font-semibold text-gray-800">Default</th>
                  <th className="text-left py-2 font-semibold text-gray-800">Description</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                <tr className="border-b">
                  <td className="py-2 pr-4">
                    <code className="text-xs bg-gray-100 px-1 rounded">duration</code>
                  </td>
                  <td className="py-2 pr-4">number</td>
                  <td className="py-2 pr-4">300</td>
                  <td className="py-2">Timer duration in seconds</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 pr-4">
                    <code className="text-xs bg-gray-100 px-1 rounded">theme</code>
                  </td>
                  <td className="py-2 pr-4">string</td>
                  <td className="py-2 pr-4">auto</td>
                  <td className="py-2">
                    Widget theme: <code className="text-xs bg-gray-100 px-1 rounded">light</code>,{" "}
                    <code className="text-xs bg-gray-100 px-1 rounded">dark</code>, or{" "}
                    <code className="text-xs bg-gray-100 px-1 rounded">auto</code>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 pr-4">
                    <code className="text-xs bg-gray-100 px-1 rounded">accent</code>
                  </td>
                  <td className="py-2 pr-4">string</td>
                  <td className="py-2 pr-4">E8613C</td>
                  <td className="py-2">Hex accent color (without #)</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 pr-4">
                    <code className="text-xs bg-gray-100 px-1 rounded">controls</code>
                  </td>
                  <td className="py-2 pr-4">string</td>
                  <td className="py-2 pr-4">full</td>
                  <td className="py-2">
                    Control buttons: <code className="text-xs bg-gray-100 px-1 rounded">full</code>,{" "}
                    <code className="text-xs bg-gray-100 px-1 rounded">minimal</code>, or{" "}
                    <code className="text-xs bg-gray-100 px-1 rounded">none</code>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 pr-4">
                    <code className="text-xs bg-gray-100 px-1 rounded">branding</code>
                  </td>
                  <td className="py-2 pr-4">string</td>
                  <td className="py-2 pr-4">full</td>
                  <td className="py-2">
                    GoTimer branding: <code className="text-xs bg-gray-100 px-1 rounded">full</code> or{" "}
                    <code className="text-xs bg-gray-100 px-1 rounded">minimal</code>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 pr-4">
                    <code className="text-xs bg-gray-100 px-1 rounded">autostart</code>
                  </td>
                  <td className="py-2 pr-4">boolean</td>
                  <td className="py-2 pr-4">false</td>
                  <td className="py-2">Start timer automatically on load</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 pr-4">
                    <code className="text-xs bg-gray-100 px-1 rounded">started</code>
                  </td>
                  <td className="py-2 pr-4">ISO 8601</td>
                  <td className="py-2 pr-4">&mdash;</td>
                  <td className="py-2">Start time for live synchronized timers</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">
                    <code className="text-xs bg-gray-100 px-1 rounded">label</code>
                  </td>
                  <td className="py-2 pr-4">string</td>
                  <td className="py-2 pr-4">&mdash;</td>
                  <td className="py-2">Timer label/title text</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Code Examples */}
        <div className="bg-white rounded-xl p-5 shadow-sm border mb-6">
          <h2 className="text-xl font-semibold mb-4">Code Examples</h2>

          <h3 className="font-medium text-gray-800 mb-2">HTML (iframe)</h3>
          <pre className="bg-gray-900 text-green-400 rounded-lg p-4 text-sm overflow-x-auto font-mono mb-4">
            {`<!-- 25-minute Pomodoro timer -->
<iframe src="https://gotimer.org/embed/interval?work=1500&rest=300&rounds=4&theme=dark"
  width="480" height="400" frameborder="0"
  allow="autoplay" loading="lazy"></iframe>`}
          </pre>

          <h3 className="font-medium text-gray-800 mb-2">React</h3>
          <pre className="bg-gray-900 text-green-400 rounded-lg p-4 text-sm overflow-x-auto font-mono mb-4">
            {`function PomodoroWidget() {
  return (
    <iframe
      src="https://gotimer.org/embed/interval?work=1500&rest=300&rounds=4"
      width={480}
      height={400}
      frameBorder="0"
      allow="autoplay"
      loading="lazy"
      style={{ borderRadius: 8 }}
    />
  );
}`}
          </pre>

          <h3 className="font-medium text-gray-800 mb-2">WordPress</h3>
          <pre className="bg-gray-900 text-green-400 rounded-lg p-4 text-sm overflow-x-auto font-mono">
            {`[gotimer type="countdown" duration="300" theme="dark"]`}
          </pre>
        </div>

        {/* Live Synchronized Timers */}
        <div className="bg-white rounded-xl p-5 shadow-sm border mb-6">
          <h2 className="text-xl font-semibold mb-2">Live Synchronized Timers</h2>
          <p className="text-gray-600 mb-3">
            Add a <code className="text-xs bg-gray-100 px-1 rounded">started</code> parameter with an
            ISO 8601 timestamp to create a live synchronized timer. All viewers see the same
            countdown — no server needed.
          </p>
          <pre className="bg-gray-900 text-green-400 rounded-lg p-4 text-sm overflow-x-auto font-mono mb-3">
            {`<iframe src="https://gotimer.org/embed/countdown?duration=3600&started=2026-04-16T10:00:00Z"
  width="480" height="400" frameborder="0"></iframe>`}
          </pre>
          <p className="text-sm text-gray-500">
            Timers expire after 24 hours. The remaining time is calculated client-side from the{" "}
            <code className="text-xs bg-gray-100 px-1 rounded">started</code> timestamp and{" "}
            <code className="text-xs bg-gray-100 px-1 rounded">duration</code>.
          </p>
        </div>

        {/* API Integration */}
        <div className="bg-white rounded-xl p-5 shadow-sm border mb-6">
          <h2 className="text-xl font-semibold mb-2">API Integration</h2>
          <p className="text-gray-600 mb-3">
            Generate embed URLs programmatically using the timer-url API:
          </p>
          <pre className="bg-gray-900 text-green-400 rounded-lg p-4 text-sm overflow-x-auto font-mono mb-4">
            {`# Generate embed code via API
curl "https://gotimer.org/api/v1/timer-url/embed?type=countdown&duration=300&theme=dark&size=standard"`}
          </pre>
          <p className="text-gray-600 mb-2 text-sm font-medium">Response:</p>
          <pre className="bg-gray-900 text-green-400 rounded-lg p-4 text-sm overflow-x-auto font-mono">
            {`{
  "status": "ok",
  "data": {
    "url": "https://gotimer.org/embed/countdown?...",
    "html": "<div>...</div>",
    "timer_type": "countdown"
  }
}`}
          </pre>
        </div>

        {/* AI Integration (MCP) */}
        <div className="bg-white rounded-xl p-5 shadow-sm border mb-6">
          <h2 className="text-xl font-semibold mb-2">AI Integration (MCP)</h2>
          <p className="text-gray-600 mb-3">
            GoTimer has an MCP server that lets AI assistants like Claude create and embed timers.
          </p>
          <pre className="bg-gray-900 text-green-400 rounded-lg p-4 text-sm overflow-x-auto font-mono mb-3">
            {`npx gotimer-mcp`}
          </pre>
          <p className="text-gray-600 mb-3">
            Use the <code className="text-xs bg-gray-100 px-1 rounded">get_embed_code</code> tool to
            generate embed snippets programmatically from any MCP-compatible AI assistant.
          </p>
          <a
            href="https://www.npmjs.com/package/gotimer-mcp"
            target="_blank"
            rel="noopener"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View MCP package on npm
          </a>
        </div>

        {/* Sizes Reference */}
        <div className="bg-white rounded-xl p-5 shadow-sm border mb-6">
          <h2 className="text-xl font-semibold mb-4">Sizes Reference</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 pr-4 font-semibold text-gray-800">Size</th>
                  <th className="text-left py-2 pr-4 font-semibold text-gray-800">Dimensions</th>
                  <th className="text-left py-2 font-semibold text-gray-800">Best For</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                <tr className="border-b">
                  <td className="py-2 pr-4">Compact</td>
                  <td className="py-2 pr-4">
                    <code className="text-xs bg-gray-100 px-1 rounded">300 x 250</code>
                  </td>
                  <td className="py-2">Sidebars, widgets</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 pr-4">Standard</td>
                  <td className="py-2 pr-4">
                    <code className="text-xs bg-gray-100 px-1 rounded">480 x 400</code>
                  </td>
                  <td className="py-2">Content area, articles</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">Large</td>
                  <td className="py-2 pr-4">
                    <code className="text-xs bg-gray-100 px-1 rounded">640 x 500</code>
                  </td>
                  <td className="py-2">Full-width sections</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-4 mb-8 flex items-center justify-between">
          <Link href="/developers" className="text-blue-600 hover:text-blue-800">
            Back to API Docs
          </Link>
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            Back to Home
          </Link>
        </div>
      </div>
      <Footer />
    </main>
  );
}
