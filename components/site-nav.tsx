import Link from "next/link";
import SiteAuth from "./site-auth";

export default async function SiteNav() {
  return (
    <nav className="w-full flex items-center justify-center border-b">
      {/* left */}
      <div className="w-full max-w-7xl mx-auto flex items-center justify-center p-2">
        <div className="w-full flex items-center">
          <div className="flex-1 flex items-center">
            <Link href="/" className="font-bold text-2xl">
              CEP
            </Link>
          </div>
          <div className="flex-1 flex items-center justify-end">
            <SiteAuth />
          </div>
        </div>
      </div>
    </nav>
  );
}
