import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Career Compass",
  description: "Your smart career tracker",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex h-screen">
          {/* Sidebar */}
          <aside className="w-64 bg-gray-100 p-4 space-y-4 shadow-md">
            <h2 className="text-xl font-bold mb-4">Career Compass</h2>
            <nav className="flex flex-col gap-2">
              <a href="/" className="hover:underline">🏠 Home</a>
              <a href="/powerbi" className="hover:underline">📊 Power BI</a>
              <a href="/resume" className="hover:underline">📄 Resume</a>
              <a href="/jobs" className="hover:underline">💼 Jobs</a>
              <a href="/application" className="hover:underline">📝 Applications</a>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-6 overflow-auto bg-white">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
