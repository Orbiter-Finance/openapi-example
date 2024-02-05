import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import '@rainbow-me/rainbowkit/styles.css';

import Provider from "./provider";
const inter = Inter({ subsets: ["latin"] });


export const metadata: Metadata = {
  title: "Orbiter Finance",
  description: "rbiter Finance",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {



  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Provider>
          <section className="flex-1 space-y-4 p-4 lg:p-8 pt-6">
            {children}
          </section>
        </Provider>
      </body>
    </html>
  );
}
