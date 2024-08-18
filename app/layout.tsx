import SiteNav from "@/components/site-nav";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Events Platform",
  description: "Events",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col items-center">
        <SiteNav />
        <main className="w-full min-h-screen flex flex-col gap-y-4 items-center">
          {children}
        </main>
        <Toaster />
        <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs mt-4">
          <p>
            Powered by{" "}
            <a
              href="https://supabase.com"
              target="_blank"
              className="font-bold hover:underline"
              rel="noreferrer"
            >
              Supabase
            </a>
          </p>
        </footer>
      </body>
    </html>
  );
}
