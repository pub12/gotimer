import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { promises as fs } from "fs";
import path from "path";

type Partner = {
  name: string;
  url: string;
  description?: string;
  snippet?: string;
  badge?: {
    src: string;
    width?: number;
    height?: number;
  };
};

async function getPartners(): Promise<Partner[]> {
  try {
    const filePath = path.join(process.cwd(), "public", "partners.json");
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export const revalidate = 3600;

function PartnerSnippet({ html }: { html: string }) {
  // partners.json is a server-owned file, not user input — safe to render
  return <div className="flex-shrink-0" dangerouslySetInnerHTML={{ __html: html }} />;
}

export default async function PartnersPage() {
  const partners = await getPartners();

  return (
    <main className="min-h-screen flex flex-col items-center bg-gray-50 p-4 pt-20">
      <Navbar />
      <div className="w-full max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Partners & Listings</h1>
        <p className="text-gray-600 mb-8">
          GoTimer is listed on the following directories and partner sites.
        </p>

        {partners.length === 0 ? (
          <p className="text-gray-500">No partner listings yet.</p>
        ) : (
          <div className="space-y-4">
            {partners.map((partner) => (
              <div
                key={partner.url}
                className="bg-white rounded-xl p-5 shadow-sm border hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="font-semibold text-lg text-gray-900">
                      <a href={partner.url} target="_blank" rel="noopener" className="no-underline text-gray-900 hover:text-blue-600">
                        {partner.name}
                      </a>
                    </h2>
                    {partner.description && (
                      <p className="text-sm text-gray-600 mt-1">{partner.description}</p>
                    )}
                  </div>
                  {partner.snippet ? (
                    <PartnerSnippet html={partner.snippet} />
                  ) : partner.badge ? (
                    <a href={partner.url} target="_blank" rel="noopener" className="flex-shrink-0">
                      <img
                        src={partner.badge.src}
                        alt={partner.name}
                        width={partner.badge.width || 150}
                        height={partner.badge.height || 54}
                      />
                    </a>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            Back to Home
          </Link>
        </div>
      </div>
      <Footer />
    </main>
  );
}
