import { UserProvider } from "@/providers/UserProvider";
import { PaddleProvider } from "@/utils/paddle/PaddleContaxt";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          <PaddleProvider>
            {children}
          </PaddleProvider>
        </UserProvider>
      </body>
    </html>
  );
}
