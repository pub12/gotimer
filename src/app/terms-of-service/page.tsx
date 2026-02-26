import Navbar from "@/components/navbar";

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-gray-50 pt-20">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: February 2026</p>

        <section className="space-y-6 text-gray-700 leading-relaxed">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Acceptance of Terms</h2>
            <p>
              By accessing or using GoTimer.org, you agree to these terms. If you do not agree,
              please do not use the site.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Service Description</h2>
            <p>
              GoTimer.org provides free online timer tools including countdown timers, chess clocks,
              and round timers. These tools are designed for personal and recreational use.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Disclaimer of Warranties</h2>
            <p>
              This service is provided &quot;as is&quot; and &quot;as available&quot; without
              warranties of any kind, either express or implied. We do not guarantee that the
              service will be uninterrupted, error-free, or available at all times. Use the
              service at your own risk.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, GoTimer.org and its operators shall not be
              liable for any indirect, incidental, or consequential damages arising from your use
              of the service.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Third-Party Services</h2>
            <p>
              GoTimer.org uses third-party services including Google Authentication and Google
              Analytics. Your use of these services is subject to their respective terms and
              privacy policies.
            </p>
            <p className="mt-2">
              We may integrate additional third-party services in the future, including advertising
              partners and additional authentication providers. These terms will be updated
              accordingly.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">User Conduct</h2>
            <p>
              You agree not to misuse the service, including attempting to disrupt its operation,
              access unauthorized areas, or use automated systems to overload the service.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Changes to Terms</h2>
            <p>
              We may update these terms from time to time. Continued use of the service after
              changes constitutes acceptance of the updated terms.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Contact</h2>
            <p>
              If you have questions about these terms, contact us
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
