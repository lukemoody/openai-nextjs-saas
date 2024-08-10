"use client";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { RecoilRoot } from "recoil";
import Navbar from "@/components/nav/Navbar";
import Sidebar from "@/components/nav/Sidebar";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <UserProvider>
        <RecoilRoot>
          <body className="w-full h-screen flex flex-col bg-gray-50">
            <Navbar />
            <main className="w-full flex-grow overflow-hidden flex flex-col md:flex-row">
              <Sidebar />
              <div className="w-full overflow-auto md:pr-32">{children}</div>
            </main>
          </body>
        </RecoilRoot>
      </UserProvider>
    </html>
  );
}
