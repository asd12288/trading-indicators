import { PaymentStatusProvider } from "@/context/payment-status-context";
import WelcomeBanner from "@/components/WelcomeBanner";

// Inside your RootLayout component, wrap your children with the provider:
export default function RootLayout({ children }) {
  return (
    <PaymentStatusProvider>
      {/* Your existing layout structure */}
      {children}
      <WelcomeBanner />
    </PaymentStatusProvider>
  );
}