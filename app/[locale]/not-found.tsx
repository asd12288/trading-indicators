import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 text-center">
      <h2 className="text-4xl font-medium">Not Found</h2>
      <p className="text-2xl">Could not find requested page</p>
      <Button className="bg-green-800 px-4 py-2 hover:bg-green-900">
        <Link href="/">Return Home</Link>
      </Button>
    </div>
  );
}
