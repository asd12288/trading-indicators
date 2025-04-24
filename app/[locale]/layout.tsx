import { UserProvider } from "@/providers/UserProvider";
import { Toaster } from "@/components/ui/sonner";

export default function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      {children}
      <Toaster />
    </UserProvider>
  );
}
