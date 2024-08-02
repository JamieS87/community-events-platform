import IndexHeader from "@/components/index-header";

import {
  LatestEventsSection,
  LoadingLatestEventsSection,
} from "@/components/latest-events-section";
import { Suspense } from "react";

export default async function Index() {
  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-20">
      <div className="w-full flex flex-col gap-20 px-2">
        <IndexHeader />
        <main className="w-full flex flex-col gap-6">
          <Suspense fallback={<LoadingLatestEventsSection />}>
            <LatestEventsSection headingText="Recently added" />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
