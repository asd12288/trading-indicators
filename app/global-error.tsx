"use client";
import { Button } from "@/components/ui/button";

// Error boundaries must be Client Components

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    // global-error must include html and body tags
    <html>
      <body>
        <div className="flex min-h-screen items-center justify-center">
          <h2 className="text-2xl font-medium">Something went wrong!</h2>
          <Button onClick={() => reset()}>Try again</Button>
        </div>
      </body>
    </html>
  );
}
