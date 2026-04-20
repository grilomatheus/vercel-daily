import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  applicationName: "Vercel Daily",
  generator: "vnews-cert-v3",
  title: {
    default: "Vercel Daily",
    template: "%s | Vercel Daily",
  },
  description: "News and insights for modern web developers.",
  openGraph: {
    title: "Vercel Daily",
    description: "News and insights for modern web developers.",
    type: "website",
    siteName: "Vercel Daily",
    locale: "en_US",
  },
};

export const viewport: Viewport = {
  themeColor: "#1a1a2e",
};

function HeaderFallback() {
  return (
    <header className="border-b border-[var(--border)] bg-white text-black">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <p className="text-lg font-semibold">Vercel Daily</p>
        <nav className="flex items-center gap-6 text-sm text-neutral-600">
          <span>Home</span>
          <span>Search</span>
        </nav>
      </div>
    </header>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#f3f3f3] text-[#0b0b0f] antialiased">
        <div className="flex min-h-screen flex-col">
          <Suspense fallback={<HeaderFallback />}>
            <Header />
          </Suspense>
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
