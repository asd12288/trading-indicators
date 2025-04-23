import { Toaster } from "@/components/ui/sonner";
import { UserProvider } from "@/providers/UserProvider";


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
