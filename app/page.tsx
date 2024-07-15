import IndexEventsList from "@/components/index-events-list";
import IndexHeader from "@/components/index-header";
import { Suspense } from "react";

export default async function Index() {
  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-20">
      <div className="w-full flex flex-col gap-20 px-2">
        <IndexHeader />
        <main className="w-full flex flex-col gap-6">
          <section className="w-full">
            <Suspense fallback={<div>Loading events...</div>}>
              <IndexEventsList />
            </Suspense>
          </section>
        </main>
      </div>
      <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs">
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
    </div>
  );
}
