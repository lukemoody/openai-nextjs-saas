import { UserProvider } from "@auth0/nextjs-auth0/client";
import Navbar from "@/components/nav/Navbar";
import Sidebar from "@/components/nav/Sidebar";
import "./globals.css";

export const metadata = {
  title: "NextJS template with TypeScript, TailwindCSS, and MongoDB",
  description:
    "NextJS template with TypeScript, TailwindCSS, and MongoDB, created by @clipper.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <UserProvider>
        <body className="w-full h-screen flex flex-col bg-gray-50">
          <Navbar />
          <main className="w-full flex-grow overflow-hidden flex flex-col md:flex-row">
            <Sidebar />
            <div className="w-full overflow-auto md:pr-32">{children}</div>
          </main>
        </body>
      </UserProvider>
    </html>
  );
}
