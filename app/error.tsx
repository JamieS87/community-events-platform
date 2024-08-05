"use client";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto my-auto">
      <h2 className="text-xl font-semibold">Something went wrong</h2>
      <p>An unknown error occured</p>
      <Button onClick={reset}>Try Again</Button>
    </div>
  );
}
