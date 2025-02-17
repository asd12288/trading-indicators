import { UserProvider } from "@/providers/UserProvider";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          {/* ...existing layout content... */}
          {children}
          {/* ...existing layout content... */}
        </UserProvider>
      </body>
    </html>
  );
}
