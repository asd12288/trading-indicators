"use client";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";

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
        <div className="flex min-h-screen flex-col items-center justify-center">
          <h2 className="text-2xl font-medium">Something went wrong!</h2>
          <Link href={"/"}>
            <Button>Go back</Button>
          </Link>
        </div>
      </body>
    </html>
  );
}
