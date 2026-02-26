import Navbar from "@/components/navbar";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-gray-50 pt-20">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: February 2026</p>

        <section className="space-y-6 text-gray-700 leading-relaxed">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Overview</h2>
            <p>
              GoTimer.org (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) provides online timer tools.
              This policy explains what data we collect, how we use it, and your rights regarding that data.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Data We Collect</h2>

            <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">Google Authentication</h3>
            <p>
              When you sign in with Google, we receive your name, email address, and profile picture
              through Google OAuth. We use this information solely to identify your account and
              personalize your experience.
            </p>

            <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">Google Analytics</h3>
            <p>
              We use Google Analytics to understand how visitors use our site. Google Analytics
              collects standard usage data including cookies, page views, session duration, browser
              type, device information, and approximate geographic location. This data is aggregated
              and does not personally identify you.
            </p>

            <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">Feedback</h3>
            <p>
              If you submit feedback through our contact form, we collect the subject and message
              content along with your account information.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Third-Party Services</h2>
            <p>We currently use the following third-party services:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li><span className="font-medium">Google Authentication</span> &mdash; for user sign-in</li>
              <li><span className="font-medium">Google Analytics</span> &mdash; for site usage analytics</li>
            </ul>
            <p className="mt-3">
              In the future, we may integrate additional services including advertising partners
              and additional authentication providers (such as Facebook or Apple sign-in).
              This policy will be updated accordingly when those services are added.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">How We Use Your Data</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>To provide and maintain our timer services</li>
              <li>To identify your account when you sign in</li>
              <li>To understand how our site is used and improve it</li>
              <li>To respond to feedback and support requests</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Cookies</h2>
            <p>
              We use cookies for authentication sessions and analytics. Google Analytics sets its
              own cookies to track usage patterns. You can disable cookies in your browser settings,
              though this may affect site functionality.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Data Sharing</h2>
            <p>
              We do not sell your personal data. Data is shared only with the third-party services
              listed above as required for their functionality.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Contact</h2>
            <p>
              If you have questions about this privacy policy, contact us
              at{" "}
              <a href="mailto:pubs@hazoservices.com" className="text-blue-600 underline">
                pubs@hazoservices.com
              </a>.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
