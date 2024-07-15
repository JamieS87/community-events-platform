import SiteNav from "@/components/site-nav";
import "./globals.css";

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
      <body className="bg-background text-foreground flex flex-col items-center">
        <SiteNav />
        <main className="w-full min-h-screen flex flex-col items-center">
          {children}
        </main>
      </body>
    </html>
  );
}
