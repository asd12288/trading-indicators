import AlertToastProvider from "@/components/AlertToastProvider";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/auth-context";

export default function LocaleLayout({ children, params: { locale } }) {
  return (
    <AuthProvider>
      {children}
      <Toaster />
      <AlertToastProvider />
    </AuthProvider>
  );
}
