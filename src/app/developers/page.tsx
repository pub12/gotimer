import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { STRATEGIES, PRESETS, REGISTRY_CATEGORY_SLUGS } from "@/lib/timer-registry";

export function generateMetadata(): Metadata {
  return {
    title: "Developer API — GoTimer",
    description:
      "Integrate GoTimer into your apps and AI assistants with the public REST API. Manage timer challenges, leaderboards, and more programmatically.",
    robots: {
      index: false,
      follow: false,
    },
    openGraph: {
      title: "GoTimer Developer API",
      description:
        "Public REST API for GoTimer. Build integrations, automate challenges, and connect AI assistants to GoTimer.",
      url: "https://gotimer.org/developers",
      type: "website",
    },
  };
}

const BASE_URL = "https://gotimer.org/api/v1";

export default function DevelopersPage() {
  return (
    <main className="min-h-screen flex flex-col items-center bg-gray-50 p-4 pt-20">
      <Navbar />
      <div className="w-full max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">GoTimer API</h1>
        <p className="text-gray-600 mb-8 text-lg">
          A public REST API to integrate GoTimer into your apps, bots, and AI assistants. Create
          challenges, retrieve leaderboards, and more — all programmatically.
        </p>

        <div className="bg-white rounded-xl p-5 shadow-sm border mb-6">
          <h2 className="text-xl font-semibold mb-2">Embed Widgets</h2>
          <p className="text-gray-600 mb-3">
            Add free, customizable timer widgets to any website with a simple iframe embed.
            Countdown, chess clock, Pomodoro, and interval timers available.
          </p>
          <Link
            href="/developers/embeds"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            View Embed Documentation
          </Link>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border mb-6">
          <h2 className="text-xl font-semibold mb-2">Getting Started</h2>
          <p className="text-gray-600 mb-3">
            Some endpoints are public and require no authentication. To create challenges or join
            them via the API, you need an API key.
          </p>
          <p className="text-gray-600 mb-3">
            API keys can be generated in the GoTimer admin panel. Pass the key as a{" "}
            <code className="bg-gray-100 px-1 rounded text-sm font-mono">Bearer</code> token:
          </p>
          <pre className="bg-gray-900 text-green-400 rounded-lg p-4 text-sm overflow-x-auto font-mono">
            {`Authorization: Bearer gtmr_your_api_key_here`}
          </pre>
          <p className="text-gray-600 mt-3">
            Or use the <code className="bg-gray-100 px-1 rounded text-sm font-mono">X-API-Key</code>{" "}
            header instead.
          </p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border mb-6">
          <h2 className="text-xl font-semibold mb-4">Endpoints</h2>

          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded font-mono">
                  GET
                </span>
                <code className="text-sm font-mono">/api/v1/timers</code>
                <span className="text-xs text-gray-500">public</span>
              </div>
              <p className="text-sm text-gray-600">
                List all {Object.keys(STRATEGIES).length} timer strategies with default configurations.
              </p>
            </div>

            <div className="border-l-4 border-blue-500 pl-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded font-mono">
                  GET
                </span>
                <code className="text-sm font-mono">/api/v1/timer-presets</code>
                <span className="text-xs text-gray-500">public</span>
              </div>
              <p className="text-sm text-gray-600">
                List all {Object.keys(PRESETS).length} timer presets. Optional{" "}
                <code className="text-xs bg-gray-100 px-1 rounded">category</code> filter ({REGISTRY_CATEGORY_SLUGS.join(", ")}).
              </p>
            </div>

            <div className="border-l-4 border-blue-500 pl-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded font-mono">
                  GET
                </span>
                <code className="text-sm font-mono">/api/v1/challenges</code>
                <span className="text-xs text-gray-500">public</span>
              </div>
              <p className="text-sm text-gray-600">List all public challenges with scores.</p>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded font-mono">
                  POST
                </span>
                <code className="text-sm font-mono">/api/v1/challenges</code>
                <span className="text-xs text-gray-500 bg-yellow-50 border border-yellow-200 px-1 rounded">
                  API key required
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Create a new challenge. Body: <code className="text-xs bg-gray-100 px-1 rounded">name</code>,{" "}
                <code className="text-xs bg-gray-100 px-1 rounded">format</code>,{" "}
                <code className="text-xs bg-gray-100 px-1 rounded">timer_type</code>,{" "}
                <code className="text-xs bg-gray-100 px-1 rounded">is_public</code>
              </p>
            </div>

            <div className="border-l-4 border-blue-500 pl-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded font-mono">
                  GET
                </span>
                <code className="text-sm font-mono">/api/v1/challenges/:id</code>
                <span className="text-xs text-gray-500">public</span>
              </div>
              <p className="text-sm text-gray-600">
                Get challenge details, leaderboard, and game history.
              </p>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded font-mono">
                  POST
                </span>
                <code className="text-sm font-mono">/api/v1/challenges/:id/join</code>
                <span className="text-xs text-gray-500 bg-yellow-50 border border-yellow-200 px-1 rounded">
                  API key required
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Join a group challenge using its join code. Body:{" "}
                <code className="text-xs bg-gray-100 px-1 rounded">join_code</code>
              </p>
            </div>

            <div className="border-l-4 border-blue-500 pl-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded font-mono">GET</span>
                <code className="text-sm font-mono">/api/v1/timer-url</code>
                <span className="text-xs text-gray-500">public</span>
              </div>
              <p className="text-sm text-gray-600">
                Generate a shareable timer URL. Accepts strategy IDs or preset IDs (e.g. pomodoro, hiit).
                Params: <code className="text-xs bg-gray-100 px-1 rounded">type</code>,{" "}
                <code className="text-xs bg-gray-100 px-1 rounded">duration</code>,{" "}
                <code className="text-xs bg-gray-100 px-1 rounded">label</code>
              </p>
            </div>

            <div className="border-l-4 border-blue-500 pl-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded font-mono">GET</span>
                <code className="text-sm font-mono">/api/v1/timer-url/embed</code>
                <span className="text-xs text-gray-500">public</span>
              </div>
              <p className="text-sm text-gray-600">
                Generate embed HTML code. Params: <code className="text-xs bg-gray-100 px-1 rounded">type</code>,{" "}
                <code className="text-xs bg-gray-100 px-1 rounded">duration</code>,{" "}
                <code className="text-xs bg-gray-100 px-1 rounded">theme</code>,{" "}
                <code className="text-xs bg-gray-100 px-1 rounded">size</code>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border mb-6">
          <h2 className="text-xl font-semibold mb-2">Blog Management API</h2>
          <p className="text-gray-600 mb-4">
            Programmatic blog management for AI content pipelines. All blog endpoints require a{" "}
            <code className="bg-gray-100 px-1 rounded text-sm font-mono">BLOG_API_KEY</code> Bearer token.
          </p>

          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded font-mono">
                  GET
                </span>
                <code className="text-sm font-mono">/api/blog/manage</code>
                <span className="text-xs text-gray-500 bg-yellow-50 border border-yellow-200 px-1 rounded">
                  API key required
                </span>
              </div>
              <p className="text-sm text-gray-600">
                List all blog posts (including drafts) with full fields. Use{" "}
                <code className="text-xs bg-gray-100 px-1 rounded">?fields=minimal</code> for a lightweight response
                without content.
              </p>
            </div>

            <div className="border-l-4 border-blue-500 pl-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded font-mono">
                  GET
                </span>
                <code className="text-sm font-mono">/api/blog/manage/:slug</code>
                <span className="text-xs text-gray-500 bg-yellow-50 border border-yellow-200 px-1 rounded">
                  API key required
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Fetch a single post by slug with all fields including parsed{" "}
                <code className="text-xs bg-gray-100 px-1 rounded">faq_json</code>. Returns 404 if not found.
              </p>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded font-mono">
                  POST
                </span>
                <code className="text-sm font-mono">/api/blog/manage</code>
                <span className="text-xs text-gray-500 bg-yellow-50 border border-yellow-200 px-1 rounded">
                  API key required
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Create or full-update (upsert) a blog post by slug. Required:{" "}
                <code className="text-xs bg-gray-100 px-1 rounded">slug</code>,{" "}
                <code className="text-xs bg-gray-100 px-1 rounded">title</code>,{" "}
                <code className="text-xs bg-gray-100 px-1 rounded">content</code>. Also accepts:{" "}
                <code className="text-xs bg-gray-100 px-1 rounded">category_id</code>,{" "}
                <code className="text-xs bg-gray-100 px-1 rounded">category_name</code>,{" "}
                <code className="text-xs bg-gray-100 px-1 rounded">meta_title</code>,{" "}
                <code className="text-xs bg-gray-100 px-1 rounded">meta_description</code>,{" "}
                <code className="text-xs bg-gray-100 px-1 rounded">character_id</code>,{" "}
                <code className="text-xs bg-gray-100 px-1 rounded">faq_json</code>,{" "}
                <code className="text-xs bg-gray-100 px-1 rounded">status</code>.
              </p>
            </div>

            <div className="border-l-4 border-yellow-500 pl-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-0.5 rounded font-mono">
                  PATCH
                </span>
                <code className="text-sm font-mono">/api/blog/manage</code>
                <span className="text-xs text-gray-500 bg-yellow-50 border border-yellow-200 px-1 rounded">
                  API key required
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Partial update — only fields present in the request body are changed. Requires{" "}
                <code className="text-xs bg-gray-100 px-1 rounded">slug</code> as lookup key. Accepts any combination of:{" "}
                <code className="text-xs bg-gray-100 px-1 rounded">title</code>,{" "}
                <code className="text-xs bg-gray-100 px-1 rounded">content</code>,{" "}
                <code className="text-xs bg-gray-100 px-1 rounded">category_id</code>,{" "}
                <code className="text-xs bg-gray-100 px-1 rounded">meta_title</code>,{" "}
                <code className="text-xs bg-gray-100 px-1 rounded">meta_description</code>,{" "}
                <code className="text-xs bg-gray-100 px-1 rounded">character_id</code>,{" "}
                <code className="text-xs bg-gray-100 px-1 rounded">faq_json</code>,{" "}
                <code className="text-xs bg-gray-100 px-1 rounded">status</code>.
                Untouched fields are preserved. Returns 404 if slug not found, 400 if no fields provided.
              </p>
            </div>

            <div className="border-l-4 border-blue-500 pl-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded font-mono">
                  GET
                </span>
                <code className="text-sm font-mono">/api/blog/characters</code>
                <span className="text-xs text-gray-500 bg-yellow-50 border border-yellow-200 px-1 rounded">
                  API key required
                </span>
              </div>
              <p className="text-sm text-gray-600">
                List all available mascot characters with IDs, names, and image paths for use in{" "}
                <code className="text-xs bg-gray-100 px-1 rounded">character_id</code> assignment.
              </p>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded font-mono">
                  POST
                </span>
                <code className="text-sm font-mono">/api/blog/images</code>
                <span className="text-xs text-gray-500 bg-yellow-50 border border-yellow-200 px-1 rounded">
                  API key required
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Upload a blog image by URL. Body:{" "}
                <code className="text-xs bg-gray-100 px-1 rounded">image_url</code> (required),{" "}
                <code className="text-xs bg-gray-100 px-1 rounded">filename</code>,{" "}
                <code className="text-xs bg-gray-100 px-1 rounded">alt</code>.
                Max 5MB. Accepts PNG, JPEG, WebP. Returns the stored image path.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border mb-6">
          <h2 className="text-xl font-semibold mb-3">Response Format</h2>
          <p className="text-gray-600 mb-3">All API responses follow a consistent format:</p>
          <pre className="bg-gray-900 text-green-400 rounded-lg p-4 text-sm overflow-x-auto font-mono">
            {`// Success
{ "status": "ok", "data": { ... } }

// Error
{ "status": "error", "error": "message" }`}
          </pre>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border mb-6">
          <h2 className="text-xl font-semibold mb-3">Examples</h2>

          <h3 className="font-medium text-gray-800 mb-2">List timer types (curl)</h3>
          <pre className="bg-gray-900 text-green-400 rounded-lg p-4 text-sm overflow-x-auto font-mono mb-4">
            {`curl ${BASE_URL}/timers`}
          </pre>

          <h3 className="font-medium text-gray-800 mb-2">List public challenges (curl)</h3>
          <pre className="bg-gray-900 text-green-400 rounded-lg p-4 text-sm overflow-x-auto font-mono mb-4">
            {`curl ${BASE_URL}/challenges`}
          </pre>

          <h3 className="font-medium text-gray-800 mb-2">Create a challenge (curl)</h3>
          <pre className="bg-gray-900 text-green-400 rounded-lg p-4 text-sm overflow-x-auto font-mono mb-4">
            {`curl -X POST ${BASE_URL}/challenges \\
  -H "Authorization: Bearer gtmr_your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{"name":"Weekly Chess Blitz","format":"group","timer_type":"chess-clock"}'`}
          </pre>

          <h3 className="font-medium text-gray-800 mb-2">List public challenges (JavaScript)</h3>
          <pre className="bg-gray-900 text-green-400 rounded-lg p-4 text-sm overflow-x-auto font-mono mb-4">
            {`const res = await fetch("${BASE_URL}/challenges");
const { data } = await res.json();
console.log(data.challenges);`}
          </pre>

          <h3 className="font-medium text-gray-800 mb-2">Create a challenge (JavaScript)</h3>
          <pre className="bg-gray-900 text-green-400 rounded-lg p-4 text-sm overflow-x-auto font-mono mb-4">
            {`const res = await fetch("${BASE_URL}/challenges", {
  method: "POST",
  headers: {
    "Authorization": "Bearer gtmr_your_api_key",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: "Weekend Tournament",
    format: "group",
    timer_type: "countdown",
  }),
});
const { data } = await res.json();
console.log(data.challenge);`}
          </pre>

          <h3 className="font-medium text-gray-800 mt-6 mb-2">List fitness presets (curl)</h3>
          <pre className="bg-gray-900 text-green-400 rounded-lg p-4 text-sm overflow-x-auto font-mono mb-4">
            {`curl "${BASE_URL}/timer-presets?category=fitness"`}
          </pre>

          <h3 className="font-medium text-gray-800 mb-2">Create a Pomodoro timer URL (curl)</h3>
          <pre className="bg-gray-900 text-green-400 rounded-lg p-4 text-sm overflow-x-auto font-mono mb-4">
            {`curl "${BASE_URL}/timer-url?type=pomodoro"`}
          </pre>

          <h3 className="font-medium text-gray-800 mt-6 mb-2">List all blog posts (curl)</h3>
          <pre className="bg-gray-900 text-green-400 rounded-lg p-4 text-sm overflow-x-auto font-mono mb-4">
            {`curl https://gotimer.org/api/blog/manage \\
  -H "Authorization: Bearer \$BLOG_API_KEY"`}
          </pre>

          <h3 className="font-medium text-gray-800 mb-2">Get a single blog post (curl)</h3>
          <pre className="bg-gray-900 text-green-400 rounded-lg p-4 text-sm overflow-x-auto font-mono mb-4">
            {`curl https://gotimer.org/api/blog/manage/pomodoro-technique-guide \\
  -H "Authorization: Bearer \$BLOG_API_KEY"`}
          </pre>

          <h3 className="font-medium text-gray-800 mb-2">Partial update — change only character (curl)</h3>
          <pre className="bg-gray-900 text-green-400 rounded-lg p-4 text-sm overflow-x-auto font-mono mb-4">
            {`curl -X PATCH https://gotimer.org/api/blog/manage \\
  -H "Authorization: Bearer \$BLOG_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"slug":"pomodoro-technique-guide","character_id":"96bfe1fe-..."}'`}
          </pre>

          <h3 className="font-medium text-gray-800 mb-2">Upload a blog image (curl)</h3>
          <pre className="bg-gray-900 text-green-400 rounded-lg p-4 text-sm overflow-x-auto font-mono">
            {`curl -X POST https://gotimer.org/api/blog/images \\
  -H "Authorization: Bearer \$BLOG_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"image_url":"https://example.com/image.png","filename":"hero.png","alt":"Blog hero image"}'`}
          </pre>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border mb-8">
          <h2 className="text-xl font-semibold mb-2">OpenAPI Specification</h2>
          <p className="text-gray-600 mb-3">
            The full OpenAPI 3.0 specification is available for use with tools like Swagger UI,
            Postman, or code generators.
          </p>
          <a
            href="/api/openapi.json"
            target="_blank"
            rel="noopener"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            View OpenAPI Spec (JSON)
          </a>
        </div>

        <div className="mt-4 text-center">
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            Back to Home
          </Link>
        </div>
      </div>
      <Footer />
    </main>
  );
}
