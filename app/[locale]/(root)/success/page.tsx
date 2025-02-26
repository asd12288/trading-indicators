import { Link } from "@/i18n/routing";

export default function SuccessPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="max-w-md space-y-6">
        <div className="mx-auto inline-block rounded-full bg-green-100 p-3 text-green-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold">Subscription Successful!</h1>

        <p className="text-gray-500">
          Thank you for subscribing to our premium plan. Your account has been
          upgraded and you now have access to all premium features.
        </p>

        <div className="pt-4">
          <Link
            href="/dashboard"
            className="bg-primary hover:bg-primary/90 inline-flex items-center justify-center rounded-md px-6 py-2 font-medium text-white"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
