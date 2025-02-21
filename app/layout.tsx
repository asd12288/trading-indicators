import { UserProvider } from "@/providers/UserProvider";
import { PaddleProvider } from "@/utils/paddle/PaddleContaxt";
import "./globals.css";


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="">
        <UserProvider>
          <PaddleProvider>{children}</PaddleProvider>
        </UserProvider>
      </body>
    </html>
  );
}
