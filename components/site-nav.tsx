import Link from "next/link";
import SiteAuth from "./site-auth";

export default async function SiteNav() {
  return (
    <nav className="w-full max-w-6xl mx-auto flex items-center justify-center p-2">
      {/* left */}
      <div className="w-full flex items-center">
        <div className="flex-1 flex items-center">
          <Link href="/">Brand</Link>
        </div>
        <div className="flex-1 flex items-center justify-end">
          <SiteAuth />
        </div>
      </div>
    </nav>
  );
}
