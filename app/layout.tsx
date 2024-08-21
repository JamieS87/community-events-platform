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
      <body className="flex flex-col bg-background text-foreground">
        <SiteNav />
        <main className="flex flex-col w-full min-h-screen">{children}</main>
        <Toaster />
        <footer className="w-full p-8 flex justify-center text-center bg-secondary text-secondary-foreground text-xs border-t border-t-primary/20">
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
